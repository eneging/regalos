"use client";

import Link from "next/link";
import { Home, ReceiptText, BadgePercent, Store
     //Layers
     } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-orange-500 rounded-t-3xl md:hidden z-50">
      <div className="flex justify-around items-center h-16 px-2">
        <Link
          href="/"
          className="flex flex-col items-center text-gray-100 hover:text-black transition"
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Inicio</span>
        </Link>

        <Link
          href="/store"
          className="flex flex-col items-center text-gray-100 hover:text-black transition"
        >
         <Store className=" w-5 h-5"/>
          <span className="text-[11px]">Licoreria</span>
        </Link>

        <Link
          href="/promociones"
          className="flex flex-col items-center text-gray-100 hover:text-black transition"
        >
            <BadgePercent className=" w-5 h-5 " />

          <span className="text-[11px]">promociones</span>
        </Link>


      

        <Link
          href="/checkout"
          className="flex flex-col items-center text-gray-100 hover:text-purple-300 transition"
        >
            <ReceiptText className="w-5 h-5" />
       
          <span className="text-[11px]">checkout</span>
        </Link>
      </div>
    </nav>
  );
}
