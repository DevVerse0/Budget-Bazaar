import './globals.css';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
export const metadata = { title: 'Budget Bazar Service - Best Gadgets, Best Prices', description: 'Budget Bazar Service - Premium gadgets at unbeatable prices' };
export const runtime = 'edge'; // Cloudflare Pages - all routes run on Edge
export default function RootLayout({children}:{children:React.ReactNode}){
  return (<html lang="en"><body className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 pb-20 md:pb-0">{children}</main>
    <MobileNav />
    <style dangerouslySetInnerHTML={{__html:"a[href*='netlify']{display:none!important} div[style*='Powered by Netlify']{display:none!important}"}}/>
  </body></html>);
}
