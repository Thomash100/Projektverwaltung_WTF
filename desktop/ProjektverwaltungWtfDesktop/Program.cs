using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Windows.Forms;

namespace ProjektverwaltungWtfDesktop;

internal static class AppInfo
{
    public const string ProductName = "Projektverwaltung_WTF";
    public const string Version = "26.05.15.004.DEV.BETA";
    public const string Channel = "DEV.BETA";
    public const bool IsStable = false;
    public const string UpdateManifestUrl = "https://raw.githubusercontent.com/Thomash100/Projektverwaltung_WTF/master/update.json";
    public const string SetupDownloadUrl = "https://github.com/Thomash100/Projektverwaltung_WTF/raw/master/dist/Projektverwaltung_WTF_Setup_Einzelplatz.exe";
}

internal static class Program
{
    [STAThread]
    private static void Main(string[] args)
    {
        if (args.Any(arg => arg.Equals("/self-test", StringComparison.OrdinalIgnoreCase)))
        {
            Environment.ExitCode = DesktopRuntime.SelfTest();
            return;
        }

        ApplicationConfiguration.Initialize();
        Application.SetHighDpiMode(HighDpiMode.PerMonitorV2);
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new MainForm());
    }
}

internal sealed class MainForm : Form
{
    private readonly DesktopRuntime runtime = new();
    private readonly Microsoft.Web.WebView2.WinForms.WebView2 webView = new();
    private readonly StatusStrip statusStrip = new();
    private readonly ToolStripStatusLabel statusLabel = new();

    public MainForm()
    {
        Text = $"{AppInfo.ProductName} {AppInfo.Version}";
        MinimumSize = new Size(1180, 760);
        Size = new Size(1440, 930);
        StartPosition = FormStartPosition.CenterScreen;

        var menu = BuildMenu();
        MainMenuStrip = menu;
        Controls.Add(menu);

        webView.Dock = DockStyle.Fill;
        webView.DefaultBackgroundColor = Color.FromArgb(244, 246, 244);
        Controls.Add(webView);

        statusLabel.Text = $"Version {AppInfo.Version} - Bereit";
        statusStrip.Items.Add(statusLabel);
        Controls.Add(statusStrip);

        Load += async (_, _) => await StartApplicationAsync();
        FormClosing += (_, _) => runtime.Dispose();
    }

    private MenuStrip BuildMenu()
    {
        var menu = new MenuStrip();
        var file = new ToolStripMenuItem("&Datei");
        var view = new ToolStripMenuItem("&Ansicht");
        var help = new ToolStripMenuItem("&Hilfe");

        file.DropDownItems.Add("Öffnen", null, async (_, _) => await ExecuteAppScriptAsync("window.ProjektverwaltungApp?.openFile?.()"));
        file.DropDownItems.Add("Speichern", null, async (_, _) => await ExecuteAppScriptAsync("window.ProjektverwaltungApp?.saveFile?.()"));
        file.DropDownItems.Add("Speichern unter", null, async (_, _) => await ExecuteAppScriptAsync("window.ProjektverwaltungApp?.saveFileAs?.()"));
        file.DropDownItems.Add(new ToolStripSeparator());
        file.DropDownItems.Add("Beenden", null, (_, _) => Close());
        view.DropDownItems.Add("Neu laden", null, (_, _) => webView.Reload());
        view.DropDownItems.Add("Startseite", null, (_, _) => webView.Source = new Uri(runtime.Url));
        help.DropDownItems.Add("Kontextbezogene Hilfe", null, async (_, _) => await ExecuteAppScriptAsync("window.ProjektverwaltungApp?.toggleHelp?.()"));
        help.DropDownItems.Add("Nach Updates suchen", null, async (_, _) => await CheckForUpdatesAsync(manual: true));
        help.DropDownItems.Add(new ToolStripSeparator());
        help.DropDownItems.Add("Info", null, (_, _) =>
        {
            MessageBox.Show(
                $"{AppInfo.ProductName}\nVersion {AppInfo.Version}\nKanal: {AppInfo.Channel}\n\nLokale Einzelplatz-App für Architektur- und Ingenieurbüros.",
                "Info",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        });

        menu.Items.Add(file);
        menu.Items.Add(view);
        menu.Items.Add(help);
        return menu;
    }

    private async Task StartApplicationAsync()
    {
        try
        {
            if (!BetaDisclaimer.EnsureAccepted(this))
            {
                statusLabel.Text = "Developer-Beta nicht bestätigt";
                BeginInvoke(new Action(Close));
                return;
            }

            statusLabel.Text = $"Version {AppInfo.Version} - lokale App wird gestartet...";
            await runtime.StartAsync();

            var userData = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Projektverwaltung_WTF",
                "WebView2");

            var environment = await Microsoft.Web.WebView2.Core.CoreWebView2Environment.CreateAsync(null, userData);
            await webView.EnsureCoreWebView2Async(environment);
            webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;
            webView.CoreWebView2.Settings.AreDevToolsEnabled = false;
            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            webView.CoreWebView2.WebMessageReceived += HandleWebMessage;
            webView.Source = new Uri(runtime.Url);
            statusLabel.Text = $"Version {AppInfo.Version} - lokal verbunden";

            BeginInvoke(new Action(async () => await CheckForUpdatesAsync(manual: false)));
        }
        catch (Exception ex)
        {
            statusLabel.Text = "Start fehlgeschlagen";
            MessageBox.Show(
                $"Die Windows-App konnte nicht gestartet werden.\n\n{ex.Message}",
                "Projektverwaltung_WTF",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
        }
    }

    private async Task CheckForUpdatesAsync(bool manual)
    {
        await AppUpdater.CheckForUpdatesAsync(this, manual, text => statusLabel.Text = text);
    }

    private async Task ExecuteAppScriptAsync(string script)
    {
        if (webView.CoreWebView2 is null) return;
        await webView.CoreWebView2.ExecuteScriptAsync(script);
    }

    private void HandleWebMessage(object? sender, Microsoft.Web.WebView2.Core.CoreWebView2WebMessageReceivedEventArgs args)
    {
        try
        {
            using var message = JsonDocument.Parse(args.WebMessageAsJson);
            var root = message.RootElement;
            var type = root.GetProperty("type").GetString();

            if (type is "saveData" or "saveDataAs")
            {
                SaveData(root, forceDialog: type == "saveDataAs");
                return;
            }

            if (type == "openData")
            {
                OpenData();
                return;
            }

            if (type == "openExternalFile")
            {
                var path = root.TryGetProperty("path", out var pathElement) ? pathElement.GetString() : "";
                OpenExternalFile(path);
            }
        }
        catch (Exception ex)
        {
            PostDesktopError(ex.Message);
        }
    }

    private void SaveData(JsonElement message, bool forceDialog)
    {
        var payload = message.GetProperty("payload").GetString() ?? "{}";
        var suggested = message.TryGetProperty("fileName", out var fileNameElement)
            ? fileNameElement.GetString()
            : "Projektverwaltung_WTF.wtf.json";

        using var dialog = new SaveFileDialog
        {
            Title = "Projektverwaltung_WTF speichern",
            Filter = "Projektverwaltung_WTF (*.wtf.json)|*.wtf.json|JSON-Dateien (*.json)|*.json|Alle Dateien (*.*)|*.*",
            FileName = string.IsNullOrWhiteSpace(suggested) ? "Projektverwaltung_WTF.wtf.json" : suggested,
            AddExtension = true,
            DefaultExt = "wtf.json",
            OverwritePrompt = true
        };

        if (!forceDialog && !string.IsNullOrWhiteSpace(suggested) && Path.IsPathFullyQualified(suggested))
        {
            File.WriteAllText(suggested, payload, Encoding.UTF8);
            PostJson(new { type = "fileSaved", fileName = suggested });
            return;
        }

        if (dialog.ShowDialog(this) != DialogResult.OK) return;
        File.WriteAllText(dialog.FileName, payload, Encoding.UTF8);
        PostJson(new { type = "fileSaved", fileName = dialog.FileName });
    }

    private void OpenData()
    {
        using var dialog = new OpenFileDialog
        {
            Title = "Projektverwaltung_WTF öffnen",
            Filter = "Projektverwaltung_WTF (*.wtf.json)|*.wtf.json|JSON-Dateien (*.json)|*.json|Alle Dateien (*.*)|*.*",
            CheckFileExists = true
        };

        if (dialog.ShowDialog(this) != DialogResult.OK) return;
        var payload = File.ReadAllText(dialog.FileName, Encoding.UTF8);
        PostJson(new { type = "fileOpened", fileName = dialog.FileName, payload });
    }

    private void OpenExternalFile(string? path)
    {
        if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
        {
            PostDesktopError("Die Datei wurde nicht gefunden.");
            return;
        }

        Process.Start(new ProcessStartInfo
        {
            FileName = path,
            UseShellExecute = true
        });
    }

    private void PostJson(object payload)
    {
        webView.CoreWebView2?.PostWebMessageAsJson(JsonSerializer.Serialize(payload));
    }

    private void PostDesktopError(string message)
    {
        PostJson(new { type = "desktopError", message });
    }
}

internal sealed class DesktopRuntime : IDisposable
{
    private Process? serverProcess;

    public string Url { get; private set; } = "";

    public async Task StartAsync()
    {
        var layout = AppLayout.Resolve();
        var port = GetFreePort();
        Url = $"http://127.0.0.1:{port}";

        var startInfo = new ProcessStartInfo
        {
            FileName = layout.NodePath,
            Arguments = Quote(layout.ServerPath),
            WorkingDirectory = layout.AppDirectory,
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardError = true,
            RedirectStandardOutput = true
        };
        startInfo.Environment["PORT"] = port.ToString();
        startInfo.Environment["HOST"] = "127.0.0.1";

        serverProcess = Process.Start(startInfo)
            ?? throw new InvalidOperationException("Der lokale Serverprozess konnte nicht gestartet werden.");

        var output = new StringBuilder();
        _ = Task.Run(async () => output.Append(await serverProcess.StandardOutput.ReadToEndAsync()));
        _ = Task.Run(async () => output.Append(await serverProcess.StandardError.ReadToEndAsync()));

        var deadline = DateTime.UtcNow.AddSeconds(12);
        using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(1) };

        while (DateTime.UtcNow < deadline)
        {
            if (serverProcess.HasExited)
            {
                throw new InvalidOperationException($"Der lokale Server wurde beendet.\n{output}");
            }

            try
            {
                using var response = await client.GetAsync(Url);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    return;
                }
            }
            catch
            {
                await Task.Delay(250);
            }
        }

        throw new TimeoutException("Der lokale Server hat nicht rechtzeitig geantwortet.");
    }

    public static int SelfTest()
    {
        using var runtime = new DesktopRuntime();
        try
        {
            runtime.StartAsync().GetAwaiter().GetResult();
            return 0;
        }
        catch
        {
            return 1;
        }
    }

    public void Dispose()
    {
        try
        {
            if (serverProcess is { HasExited: false })
            {
                serverProcess.Kill(entireProcessTree: true);
                serverProcess.Dispose();
            }
        }
        catch
        {
            // Process shutdown is best-effort during app close.
        }
    }

    private static int GetFreePort()
    {
        using var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        return ((IPEndPoint)listener.LocalEndpoint).Port;
    }

    private static string Quote(string value) => $"\"{value}\"";
}

internal sealed record AppLayout(string InstallRoot, string AppDirectory, string ServerPath, string NodePath)
{
    public static AppLayout Resolve()
    {
        var baseDirectory = AppContext.BaseDirectory.TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
        var installRoot = Directory.GetParent(baseDirectory)?.FullName ?? baseDirectory;
        var appDirectory = Path.Combine(installRoot, "app");

        if (!Directory.Exists(appDirectory))
        {
            var repoRoot = FindRepoRoot(baseDirectory);
            if (repoRoot is not null)
            {
                installRoot = repoRoot;
                appDirectory = repoRoot;
            }
        }

        var serverPath = Path.Combine(appDirectory, "server.mjs");
        var nodePath = Path.Combine(installRoot, "runtime", "node.exe");

        if (!File.Exists(nodePath))
        {
            nodePath = FindNode() ?? nodePath;
        }

        if (!File.Exists(serverPath))
        {
            throw new FileNotFoundException("server.mjs wurde nicht gefunden.", serverPath);
        }

        if (!File.Exists(nodePath))
        {
            throw new FileNotFoundException("node.exe wurde nicht gefunden.", nodePath);
        }

        return new AppLayout(installRoot, appDirectory, serverPath, nodePath);
    }

    private static string? FindRepoRoot(string start)
    {
        var directory = new DirectoryInfo(start);
        while (directory is not null)
        {
            if (File.Exists(Path.Combine(directory.FullName, "server.mjs")))
            {
                return directory.FullName;
            }

            directory = directory.Parent;
        }

        return null;
    }

    private static string? FindNode()
    {
        var candidates = new[]
        {
            Environment.GetEnvironmentVariable("PROJEKTVERWALTUNG_NODE"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Projektverwaltung_WTF", "runtime", "node.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "OpenAI", "Codex", "bin", "node.exe"),
            @"C:\Users\ThomasHofmann\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
        };

        return candidates.FirstOrDefault(path => !string.IsNullOrWhiteSpace(path) && File.Exists(path));
    }
}

internal static class BetaDisclaimer
{
    public static bool EnsureAccepted(IWin32Window owner)
    {
        if (AppInfo.IsStable || File.Exists(MarkerPath))
        {
            return true;
        }

        var result = MessageBox.Show(
            $"Developer Beta - Risiken bestätigen\n\nVersion: {AppInfo.Version}\n\n" +
            "Diese Version ist eine Developer Beta und noch keine stabile Produktivversion. " +
            "Es können Fehler auftreten, Datenmodelle können sich ändern und fachliche Berechnungen müssen vor produktiver Nutzung geprüft werden.\n\n" +
            "Bitte verwenden Sie diese Version nicht ohne eigene Datensicherung für geschäftskritische Originaldaten. " +
            "Mit Ja bestätigen Sie, dass Sie diese Hinweise verstanden haben und die Beta auf eigenes Risiko testen.",
            "Projektverwaltung_WTF Developer Beta",
            MessageBoxButtons.YesNo,
            MessageBoxIcon.Warning,
            MessageBoxDefaultButton.Button2);

        if (result != DialogResult.Yes)
        {
            return false;
        }

        Directory.CreateDirectory(Path.GetDirectoryName(MarkerPath)!);
        File.WriteAllText(MarkerPath, DateTimeOffset.Now.ToString("O"), Encoding.UTF8);
        return true;
    }

    private static string MarkerPath
    {
        get
        {
            var safeVersion = string.Concat(AppInfo.Version.Select(ch => char.IsLetterOrDigit(ch) ? ch : '_'));
            return Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                AppInfo.ProductName,
                "confirmations",
                $"accepted-beta-{safeVersion}.txt");
        }
    }
}

internal static class AppUpdater
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static async Task CheckForUpdatesAsync(Form owner, bool manual, Action<string> setStatus)
    {
        try
        {
            setStatus(manual ? "Updateprüfung läuft..." : $"Version {AppInfo.Version} - Updateprüfung...");
            var manifest = await LoadManifestAsync();

            if (manifest is null || string.IsNullOrWhiteSpace(manifest.Version))
            {
                if (manual)
                {
                    MessageBox.Show(owner, "Es konnte keine gültige Update-Information gelesen werden.", AppInfo.ProductName, MessageBoxButtons.OK, MessageBoxIcon.Information);
                }

                return;
            }

            if (CompareVersions(manifest.Version, AppInfo.Version) <= 0)
            {
                if (manual)
                {
                    MessageBox.Show(
                        owner,
                        $"Die installierte Version ist aktuell.\n\nInstalliert: {AppInfo.Version}\nVerfügbar: {manifest.Version}",
                        "Projektverwaltung_WTF Updates",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Information);
                }

                return;
            }

            var channel = manifest.Stable ? "STABLE" : (string.IsNullOrWhiteSpace(manifest.Channel) ? "DEV.BETA" : manifest.Channel);
            var releaseDate = string.IsNullOrWhiteSpace(manifest.ReleaseDate) ? "" : $"\nFreigabe: {manifest.ReleaseDate}";
            var notes = manifest.Notes.Length == 0 ? "" : "\n\nÄnderungen:\n- " + string.Join("\n- ", manifest.Notes.Take(6));

            var answer = MessageBox.Show(
                owner,
                $"Ein Update ist verfügbar.\n\nInstalliert: {AppInfo.Version}\nNeu: {manifest.Version} ({channel}){releaseDate}{notes}\n\n" +
                "Soll das Update jetzt heruntergeladen und das Setup gestartet werden?\nDie Anwendung wird danach geschlossen.",
                "Projektverwaltung_WTF Update",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Information);

            if (answer == DialogResult.Yes)
            {
                await DownloadAndLaunchInstallerAsync(owner, manifest, setStatus);
            }
        }
        catch (Exception ex)
        {
            if (manual)
            {
                MessageBox.Show(
                    owner,
                    $"Die Updateprüfung konnte nicht abgeschlossen werden.\n\n{ex.Message}",
                    "Projektverwaltung_WTF Updates",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Warning);
            }
        }
        finally
        {
            setStatus($"Version {AppInfo.Version} - Bereit");
        }
    }

    private static async Task<UpdateManifest?> LoadManifestAsync()
    {
        using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(8) };
        var separator = AppInfo.UpdateManifestUrl.Contains('?') ? '&' : '?';
        var url = $"{AppInfo.UpdateManifestUrl}{separator}t={DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
        using var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<UpdateManifest>(json, JsonOptions);
    }

    private static async Task DownloadAndLaunchInstallerAsync(Form owner, UpdateManifest manifest, Action<string> setStatus)
    {
        var downloadUrl = string.IsNullOrWhiteSpace(manifest.DownloadUrl) ? AppInfo.SetupDownloadUrl : manifest.DownloadUrl;
        var target = Path.Combine(Path.GetTempPath(), $"{AppInfo.ProductName}_Setup_{SanitizeFileName(manifest.Version)}.exe");

        setStatus("Update wird heruntergeladen...");
        using var client = new HttpClient { Timeout = TimeSpan.FromMinutes(10) };
        var bytes = await client.GetByteArrayAsync(downloadUrl);

        if (!string.IsNullOrWhiteSpace(manifest.Sha256))
        {
            var hash = Convert.ToHexString(SHA256.HashData(bytes));
            if (!hash.Equals(manifest.Sha256, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Die heruntergeladene Setup-Datei passt nicht zur veröffentlichten Prüfsumme.");
            }
        }

        await File.WriteAllBytesAsync(target, bytes);
        setStatus("Setup wird gestartet...");

        var command = $"/c timeout /t 2 /nobreak >nul & start \"\" \"{target}\"";
        Process.Start(new ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = command,
            CreateNoWindow = true,
            UseShellExecute = false
        });

        MessageBox.Show(
            owner,
            "Das Update-Setup wurde heruntergeladen und wird gleich gestartet.\n\nProjektverwaltung_WTF wird jetzt geschlossen.",
            "Projektverwaltung_WTF Update",
            MessageBoxButtons.OK,
            MessageBoxIcon.Information);

        owner.BeginInvoke(new Action(owner.Close));
    }

    private static int CompareVersions(string left, string right)
    {
        var leftParts = ExtractNumericVersion(left);
        var rightParts = ExtractNumericVersion(right);
        var count = Math.Max(leftParts.Length, rightParts.Length);

        for (var i = 0; i < count; i++)
        {
            var l = i < leftParts.Length ? leftParts[i] : 0;
            var r = i < rightParts.Length ? rightParts[i] : 0;
            if (l != r)
            {
                return l.CompareTo(r);
            }
        }

        return ChannelRank(left).CompareTo(ChannelRank(right));
    }

    private static int[] ExtractNumericVersion(string version)
    {
        var numericPrefix = new string(version.TakeWhile(ch => char.IsDigit(ch) || ch == '.').ToArray()).Trim('.');
        if (string.IsNullOrWhiteSpace(numericPrefix))
        {
            return [];
        }

        return numericPrefix
            .Split('.', StringSplitOptions.RemoveEmptyEntries)
            .Select(part => int.TryParse(part, out var number) ? number : 0)
            .ToArray();
    }

    private static int ChannelRank(string version)
    {
        var value = version.ToUpperInvariant();
        if (value.Contains("STABLE")) return 3;
        if (value.Contains("RC")) return 2;
        if (value.Contains("BETA")) return 1;
        if (value.Contains("DEV")) return 0;
        return 1;
    }

    private static string SanitizeFileName(string value)
    {
        var invalid = Path.GetInvalidFileNameChars();
        return string.Concat(value.Select(ch => invalid.Contains(ch) ? '_' : ch));
    }
}

internal sealed class UpdateManifest
{
    public string Product { get; set; } = "";
    public string Version { get; set; } = "";
    public string Channel { get; set; } = "";
    public bool Stable { get; set; }
    public string ReleaseDate { get; set; } = "";
    public string DownloadUrl { get; set; } = "";
    public string Sha256 { get; set; } = "";
    public long Size { get; set; }
    public string[] Notes { get; set; } = [];
}
