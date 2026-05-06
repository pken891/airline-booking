import './globals.css';
import Link from 'next.link';

export const metadata = {
  title: 'Dairy Flat Airyways',
  description: 'Book flights with Dairy Flat Airways Today!'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link> | <Link href="/flights">Flights</Link>
        </nav>
        <main>{children}</main>
        <footer>
          <p> 2026 Dairy Flat Airways</p>
        </footer>
      </body>
    </html>
  );
}