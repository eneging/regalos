// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
//import Script from "next/script";
//import AdSense from "./components/AdSense";
import BottomNav from "./components/BottomNav";
import { CartProvider } from "./context/CartContext";
import SliderOver from "./components/cart/SliderOver";
import { CartDrawerProvider } from "./components/cart/CartDrawerContext";
import Script from "next/script";
import { AuthProvider } from "./context/AuthContext";

//import AdBanner from "./components/Adbanner";

// Fuentes
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

declare global {
  interface Window {
    Culqi: any;
  }
}


// Metadatos globales (SEO + Redes sociales)
export const metadata: Metadata = {
  metadataBase: new URL("https://puertoricoica.online"),

  title: {
    default: "Puerto rico ica",
    template: "%s | MichiMarketing",
  },
  description:
    "Descubre las mejores herramientas de inteligencia artificial, apps y software para 2025. Explora categorías, reseñas y tendencias en MichiMarketing.",
  keywords: [
    "AI tools",
    "Marketing digital",
    "Inteligencia artificial",
    "Software 2025",
    "Directorio AI",
    "Productividad",
  ],
  authors: [{ name: "Puerto rico ica Team" }],
  creator: "Puertoricoica",
  publisher: "puertoricoica",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://puertoricoica.online",
    siteName: "MichiMarketing",
    title: "MichiMarketing - AI Tools Directory",
    description:
      "Descubre las mejores herramientas de inteligencia artificial, apps y software para 2025.",
    images: [
      {
        url: "/public/vercel.svg",
        width: 1200,
        height: 630,
        alt: "MichiMarketing Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MichiMarketing - AI Tools Directory",
    description:
      "Explora las mejores herramientas de inteligencia artificial y marketing digital en un solo lugar.",
    images: ["/og-image.png"],
    creator: "@michimarketing",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-9559644099127130"
        ></meta>

        <meta name="google-site-verification" content="4sqJ9_7alGwA2JLhpC2sHDDfTjpd9IlZS4dxfdQU5gk" />
 

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9559644099127130"
          crossOrigin="anonymous"
        />

    
      </head>

      <body

        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white font-sans`}
      >
             <Script
          src="https://sdk.mercadopago.com/js/v2"
          strategy="afterInteractive"
        />
      <AuthProvider>
        <CartDrawerProvider>
          <CartProvider>
        <Navbar></Navbar>

        <div className="    ">
         

          <main className="flex-1 min-h-screen">{children}</main>

         
        </div>
        <BottomNav></BottomNav>
        <Footer></Footer>
        
        <SliderOver ></SliderOver>
</CartProvider>

 </CartDrawerProvider>
</AuthProvider>  
     <Script
          src="https://checkout.culqi.com/js/v4"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
