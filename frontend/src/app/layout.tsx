import './globals.css';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
export const metadata = { title: 'Budget Bazar - Best Gadgets, Best Prices', description: 'Premium gadgets at unbeatable prices' };
export default function RootLayout({children}:{children:React.ReactNode}){
  return (<html lang="en"><body className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <MobileNav />
  </body></html>);
}
