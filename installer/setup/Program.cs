using System.Diagnostics;
using System.IO.Compression;
using System.Reflection;
using System.Windows.Forms;

namespace ProjektverwaltungWtfSetup;

internal static class Program
{
    private const string AppName = "Projektverwaltung_WTF";

    [STAThread]
    private static void Main(string[] args)
    {
        ApplicationConfiguration.Initialize();
        var options = SetupOptions.Parse(args);

        try
        {
            var installRoot = options.TargetPath ?? Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                AppName);

            InstallPayload(installRoot);

            if (!options.NoShortcuts)
            {
                CreateShortcuts(installRoot);
            }

            if (!options.NoLaunch)
            {
                LaunchApplication(installRoot);
            }

            if (!options.Quiet)
            {
                MessageBox.Show(
                    "Projektverwaltung_WTF wurde lokal installiert.\n\nDesktop- und Startmenue-Verknuepfungen wurden erstellt.",
                    "Projektverwaltung_WTF Setup",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information);
            }
        }
        catch (Exception ex)
        {
            if (!options.Quiet)
            {
                MessageBox.Show(
                    $"Die Installation konnte nicht abgeschlossen werden.\n\n{ex.Message}",
                    "Projektverwaltung_WTF Setup",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
            }

            Environment.ExitCode = 1;
        }
    }

    private static void InstallPayload(string installRoot)
    {
        Directory.CreateDirectory(installRoot);

        foreach (var child in new[] { "app", "runtime", "bin" })
        {
            var path = Path.Combine(installRoot, child);
            if (Directory.Exists(path))
            {
                Directory.Delete(path, recursive: true);
            }
        }

        var tempZip = Path.Combine(Path.GetTempPath(), $"{AppName}_{Guid.NewGuid():N}.zip");
        try
        {
            using (var resource = Assembly.GetExecutingAssembly().GetManifestResourceStream("payload.zip"))
            {
                if (resource is null)
                {
                    throw new InvalidOperationException("Das eingebettete Installationspaket wurde nicht gefunden.");
                }

                using var output = File.Create(tempZip);
                resource.CopyTo(output);
            }

            ZipFile.ExtractToDirectory(tempZip, installRoot, overwriteFiles: true);
        }
        finally
        {
            if (File.Exists(tempZip))
            {
                File.Delete(tempZip);
            }
        }
    }

    private static void CreateShortcuts(string installRoot)
    {
        var binDir = Path.Combine(installRoot, "bin");
        var desktopExe = Path.Combine(binDir, "Projektverwaltung_WTF.exe");
        var desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
        var programs = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
        var startMenuFolder = Path.Combine(programs, AppName);

        Directory.CreateDirectory(startMenuFolder);

        CreateShortcut(
            Path.Combine(desktop, $"{AppName}.lnk"),
            desktopExe,
            "",
            installRoot,
            "Projektverwaltung_WTF starten");

        CreateShortcut(
            Path.Combine(startMenuFolder, $"{AppName}.lnk"),
            desktopExe,
            "",
            installRoot,
            "Projektverwaltung_WTF starten");

        CreateShortcut(
            Path.Combine(startMenuFolder, $"{AppName} deinstallieren.lnk"),
            "powershell.exe",
            $"-NoProfile -ExecutionPolicy Bypass -File \"{Path.Combine(binDir, "uninstall.ps1")}\"",
            installRoot,
            "Projektverwaltung_WTF deinstallieren");
    }

    private static void CreateShortcut(string shortcutPath, string targetPath, string arguments, string workingDirectory, string description)
    {
        var shellType = Type.GetTypeFromProgID("WScript.Shell")
            ?? throw new InvalidOperationException("WScript.Shell ist auf diesem System nicht verfuegbar.");

        dynamic shell = Activator.CreateInstance(shellType)
            ?? throw new InvalidOperationException("WScript.Shell konnte nicht gestartet werden.");

        dynamic shortcut = shell.CreateShortcut(shortcutPath);
        shortcut.TargetPath = targetPath;
        shortcut.Arguments = arguments;
        shortcut.WorkingDirectory = workingDirectory;
        shortcut.Description = description;
        shortcut.IconLocation = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "System32", "shell32.dll") + ",21";
        shortcut.Save();
    }

    private static void LaunchApplication(string installRoot)
    {
        var desktopExe = Path.Combine(installRoot, "bin", "Projektverwaltung_WTF.exe");
        Process.Start(new ProcessStartInfo
        {
            FileName = desktopExe,
            WorkingDirectory = installRoot,
            UseShellExecute = true
        });
    }

    private sealed record SetupOptions(bool Quiet, bool NoLaunch, bool NoShortcuts, string? TargetPath)
    {
        public static SetupOptions Parse(string[] args)
        {
            var quiet = false;
            var noLaunch = false;
            var noShortcuts = false;
            string? targetPath = null;

            foreach (var arg in args)
            {
                if (arg.Equals("/quiet", StringComparison.OrdinalIgnoreCase))
                {
                    quiet = true;
                }
                else if (arg.Equals("/nolaunch", StringComparison.OrdinalIgnoreCase))
                {
                    noLaunch = true;
                }
                else if (arg.Equals("/noshortcuts", StringComparison.OrdinalIgnoreCase))
                {
                    noShortcuts = true;
                }
                else if (arg.StartsWith("/target=", StringComparison.OrdinalIgnoreCase))
                {
                    targetPath = arg["/target=".Length..].Trim('"');
                }
            }

            return new SetupOptions(quiet, noLaunch, noShortcuts, targetPath);
        }
    }
}
