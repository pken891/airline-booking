import './globals.css';

export const metadata = {
  title: 'Dairy Flat Airyways',
  description: 'Book flights with Dairy Flat Airways Today!'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">Home</a> | <a href="/flights">Flights</a>
        </nav>
        <main>{children}</main>
        <footer>
          <p> 2026 Dairy Falt Airways</p>
        </footer>
      </body>
    </html>
  );
}