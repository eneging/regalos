"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Tienda", href: "/store" },
    { name: "Eventos", href: "/eventos" },
    { name: "Contáctanos", href: "/contacto" },
  ];

  const contactInfo = {
    address: "Calle Ficticia 123, Ica, Perú",
    phone: "+51 933 739 769",
    email: "reservas@puertoricorestobar.com",
  };

  const socialLinks = [
    { 
      name: "Facebook", 
      href: "https://www.facebook.com/RestobarPuertoricoICA", 
      icon: <Facebook size={20} />
    },
    { 
      name: "Instagram", 
      href: "https://www.instagram.com/puertoricorestobar.ica", 
      icon: <Instagram size={20} />
    },
    { 
      name: "Twitter", 
      href: "#", 
      icon: <Twitter size={20} />
    },
  ];

  return (
    <footer className="bg-gradient-to-t from-[#0b0b0b] to-[#111] text-gray-300">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Logo */}
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Puerto Rico Restobar</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Tu destino para la mejor comida criolla, piqueos y tragos.
              Vive una experiencia inolvidable con nosotros.
            </p>
          </div>

          {/* Enlaces + Contacto */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">

            {/* Enlaces */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-5">Enlaces</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 hover:translate-x-1 transition-all duration-300 block text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-5">Contacto</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-400">{contactInfo.address}</span>
                </li>

                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-orange-500 flex-shrink-0" />
                  <a 
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} 
                    className="hover:text-orange-500 transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-orange-500 flex-shrink-0" />
                  <a 
                    href={`mailto:${contactInfo.email}`} 
                    className="hover:text-orange-500 transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Redes sociales */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-5">Síguenos</h4>
              <div className="flex space-x-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 text-gray-400 rounded-full
                               hover:bg-orange-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center sm:text-left mb-4 sm:mb-0">
            &copy; {currentYear} Puerto Rico Restobar. Todos los derechos reservados.
          </p>

          <div className="flex space-x-4 text-sm text-gray-500">
            <Link href="/terminos" className="hover:text-orange-500 transition-colors">Términos y Condiciones</Link>
            <Link href="/privacidad" className="hover:text-orange-500 transition-colors">Política de Privacidad</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
