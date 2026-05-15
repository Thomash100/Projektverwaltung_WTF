using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Windows.Forms;

namespace ProjektverwaltungWtfDesktop;

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
        Text = "Projektverwaltung_WTF";
        MinimumSize = new Size(1180, 760);
        Size = new Size(1440, 930);
        StartPosition = FormStartPosition.CenterScreen;

        var menu = BuildMenu();
        MainMenuStrip = menu;
        Controls.Add(menu);

        webView.Dock = DockStyle.Fill;
        webView.DefaultBackgroundColor = Color.FromArgb(244, 246, 244);
        Controls.Add(webView);

        statusLabel.Text = "Bereit";
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

        file.DropDownItems.Add("Beenden", null, (_, _) => Close());
        view.DropDownItems.Add("Neu laden", null, (_, _) => webView.Reload());
        view.DropDownItems.Add("Startseite", null, (_, _) => webView.Source = new Uri(runtime.Url));
        help.DropDownItems.Add("Info", null, (_, _) =>
        {
            MessageBox.Show(
                "Projektverwaltung_WTF\nLokale Einzelplatz-App fuer Architektur- und Ingenieurburos.",
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
            statusLabel.Text = "Lokale App wird gestartet...";
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
            webView.Source = new Uri(runtime.Url);
            statusLabel.Text = $"Lokal verbunden: {runtime.Url}";
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
