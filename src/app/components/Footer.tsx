"use client";

import Link from "next/link";
import { Facebook, Instagram,  Phone, Mail, MapPin, Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Catálogo", href: "/catalogo" },
    { name: "Ocasiones", href: "/categoria/aniversario" },
    { name: "Rastrea tu pedido", href: "/rastreo" },
  ];

  const contactInfo = {
    address: "Calle Ficticia 123, Ica, Perú",
    phone: "+51 933 739 769",
    email: "ventas@puertoricoregalos.com",
  };

  const socialLinks = [
    { 
      name: "Facebook", 
      href: "https://www.facebook.com/RestobarPuertoricoICA", // Puedes cambiar esto si tienen fanpage específica de regalos
      icon: <Facebook size={20} />
    },
    { 
      name: "Instagram", 
      href: "https://www.instagram.com/puertoricorestobar.ica", 
      icon: <Instagram size={20} />
    },
    // Eliminé Twitter si no es relevante, o lo mantienes
  ];

  return (
    <footer className="bg-zinc-950 border-t border-white/5 text-gray-300 ">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 1. Logo y Misión */}
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
              Puerto Rico <span className="text-rose-500">Regalos</span>
            </h3>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              Expresa lo que sientes con el detalle perfecto. 
              Especialistas en arreglos florales, peluches gigantes y sorpresas personalizadas en Ica.
            </p>
            <div className="mt-6 flex items-center gap-2 text-rose-500 text-sm font-medium">
                 <Heart size={16} className="fill-rose-500" />
                 <span>Entregando amor todos los días</span>
            </div>
          </div>

          {/* 2. Enlaces + Contacto + Social */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">

            {/* Columna Enlaces */}
            <div>
              <h4 className="text-lg font-bold text-white mb-5 border-l-4 border-rose-500 pl-3">Enlaces</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-rose-500 hover:pl-2 transition-all duration-300 block text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna Contacto */}
            <div>
              <h4 className="text-lg font-bold text-white mb-5 border-l-4 border-rose-500 pl-3">Contacto</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-rose-500 mt-1 flex-shrink-0" />
                  <span className="text-zinc-400">{contactInfo.address}</span>
                </li>

                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-rose-500 flex-shrink-0" />
                  <a 
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} 
                    className="hover:text-rose-500 transition-colors text-zinc-300"
                  >
                    {contactInfo.phone}
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-rose-500 flex-shrink-0" />
                  <a 
                    href={`mailto:${contactInfo.email}`} 
                    className="hover:text-rose-500 transition-colors text-zinc-300"
                  >
                    {contactInfo.email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna Redes & Libro */}
            <div className="flex flex-col gap-6">
               
               {/* Redes */}
               <div>
                  <h4 className="text-lg font-bold text-white mb-5 border-l-4 border-rose-500 pl-3">Síguenos</h4>
                  <div className="flex space-x-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                        className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full
                                  hover:bg-rose-600 hover:text-white hover:border-rose-500 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
               </div>

               {/* Libro de Reclamaciones */}
               <div className="mt-auto">
                    <a href="/libro-reclamaciones" className="group block w-fit">
                       <div className="bg-white p-2 rounded-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-shadow duration-300">
                          <Image
                            src="https://res.cloudinary.com/dhuggiq9q/image/upload/v1768675637/libro_de_reclamaciones_nx7tfc.jpg"
                            alt="Libro de Reclamaciones"
                            width={120}
                            height={45}
                            className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                       </div>
                       <span className="text-[10px] text-zinc-500 mt-1 block group-hover:text-rose-400 transition-colors">
                          Atención al cliente
                       </span>
                    </a>
               </div>

            </div>

          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm text-center sm:text-left">
            &copy; {currentYear} Puerto Rico Regalos. Todos los derechos reservados.
          </p>

          <div className="flex space-x-6 text-sm text-zinc-500">
            <Link href="/terminos" className="hover:text-rose-500 transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-rose-500 transition-colors">Privacidad</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}