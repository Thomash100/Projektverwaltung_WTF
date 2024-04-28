using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Projektverwaltung
{
    /// <summary>
    /// Interaktionslogik für Window2.xaml
    /// </summary>
    public partial class Window2 : Window
    {
        public Window2()
        {
            InitializeComponent();
        }

        private void Weiter_Click(object sender, RoutedEventArgs e)
        {
            // Öffne das nächste Fenster
            Window2 nextWindow = new Window2();
            nextWindow.Show();

            // Schließe dieses Fenster (optional)
            this.Close();
        }

        private void Abbrechen_Click(object sender, RoutedEventArgs e)
        {
            // Schließe dieses Fenster
            this.Close();
        }
    }
}
