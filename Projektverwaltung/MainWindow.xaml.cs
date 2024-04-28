using Microsoft.Win32;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.IO;

namespace Projektverwaltung
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // Geänderter Ereignishandler für 'Neu'
        private void Neu_Click(object sender, RoutedEventArgs e)
        {
            // Öffnet ein neues Fenster anstelle des Speichern-Dialogs
            Window1 window1 = new Window1();
            window1.Show();
        }

        // Vorhandene Ereignisbehandlungsmethoden
        // ...

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            btn_hello.Content = "Hallo";
        }
    }
}