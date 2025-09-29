"use client";
import "./globals.css";
import backIcon from '../../public/return.png'
import Link from "next/link";
import { usePathname } from "next/navigation";

// export const metadata = {
//   title: "DIY Book Builder",
//   description: "Create your own book cover and manuscript",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body className="h-screen w-full flex flex-col box-border">


        <header className="h-17 flex justify-between p-[min(0.5rem,2%)] box-border bg-gradient-to-r from-blue-400 to-purple-400">
           <div suppressHydrationWarning={true} className="w-45 px-2 h-full flex justify-between items-center">
             {/* <BackButton/> */}
            <img src="/return.png" height="23" width="23" alt="Back" />
            <img src="/amazon-big.png" height="100" width="110" alt="Back" />
           </div>
           <div className="w-100 h-full">

             <button className="h-full w-50 font-bold">
              <Link href="/book-cover" className={`flex items-center justify-center h-full w-50 text-white text-center font-medium transition-transform duration-200 ${pathname === "/book-cover" ? "scale-125 font-bold border-1 rounded-full" : "scale-90"}`}>
                BOOK COVER
              </Link>
            </button>
            <button className="h-full w-50">
              <Link href="/manuscript" className={`flex items-center justify-center h-full w-50 text-white text-center font-medium transition-transform duration-200 ${pathname === "/manuscript" ? "scale-125 font-bold border-1 rounded-full" : "scale-90"}`}>
                MANUSCRIPT
              </Link>
            </button>
              {/* <button className="h-full w-50 bg-green-300">Book Cover</button>
              <button className="text-black h-full w-50">ManuScript</button> */}
           </div>
           <div className="w-30 h-full border-1 border-red-600 flex justify-center items-center">
            SAVE
           </div>
        </header>

        <main className="flex-1 flex flex-col overflow-auto bg-gray-k00 w-full">
          {children}
        </main>

      </body>
    </html>
  );
}
