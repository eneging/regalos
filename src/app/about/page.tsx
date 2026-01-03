"use client";

import Image from "next/image";
import React, { Suspense } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const sections = [
  {
    title: "Un Sueño Hecho Realidad",
    text: [
      "Puerto Rico Restobar nació del amor por la comida criolla y los buenos momentos. Fundado en 20XX, nuestro objetivo ha sido traer los sabores vibrantes de nuestra tierra a tu mesa.",
      "Seleccionamos los ingredientes más frescos y cocinamos con cariño y tradición. En cada bocado, sentirás nuestra pasión.",
    ],
    img: "https://res.cloudinary.com/dck9uinqa/image/upload/v1761598976/Image_fx_10_logmh7.jpg",
    reverse: false,
  },
  {
    title: "Nuestra Pasión, Tu Experiencia",
    text: [
      "La comida es un lenguaje universal que une a las personas. En Puerto Rico Restobar compartimos esa pasión por la excelencia culinaria y el servicio excepcional.",
      "Desde nuestros chefs hasta el personal de sala, todos trabajamos para superar tus expectativas y hacer de cada visita una celebración.",
    ],
    img: "https://res.cloudinary.com/dck9uinqa/image/upload/v1761599061/Image_fx_11_q0yvjc.jpg",
    reverse: true,
  },
];

const services = [
  { icon: "🍽️", title: "Comida Criolla Auténtica", desc: "Platos llenos de sabor, historia y sazón casera." },
  { icon: "🍹", title: "Bebidas Exquisitas", desc: "Cócteles de autor y bebidas refrescantes únicas." },
  { icon: "🎉", title: "Eventos Inolvidables", desc: "El lugar perfecto para tus celebraciones y reuniones." },
];

function AboutUs() {
  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center px-4 py-12 md:py-20 overflow-hidden">
      {/* HERO */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center mb-14 max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-orange-500 mb-4 drop-shadow-lg leading-tight">
          Nuestra Historia ✨
        </h1>
        <p className="text-gray-300 text-lg md:text-2xl leading-relaxed">
          Descubre la pasión detrás de cada plato y cada momento en{" "}
          <strong className="text-orange-400">Puerto Rico Restobar</strong>. Somos más que un lugar para comer; somos una experiencia que deleita tus sentidos.
        </p>
      </motion.div>

      {/* SECCIONES */}
      {sections.map((s, i) => (
        <motion.section
          key={i}
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true, amount: 0.3 }}
          className={`flex flex-col ${
            s.reverse ? "md:flex-row-reverse" : "md:flex-row"
          } items-center gap-10 bg-gray-900/70 border border-gray-800 rounded-3xl p-8 md:p-12 w-full max-w-6xl mb-16`}
        >
          {/* Imagen */}
          <div className="w-full md:w-1/2">
            <Suspense fallback={<div className="w-full h-80 bg-gray-800 animate-pulse rounded-full" />}>
              <Image
                src={s.img}
                alt={s.title}
                width={600}
                height={600}
                className="rounded-full w-full h-auto object-cover shadow-md hover:scale-105 transition-transform duration-300"
              />
            </Suspense>
          </div>

          {/* Texto */}
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-400">{s.title}</h2>
            {s.text.map((t, j) => (
              <p key={j} className="text-gray-300 text-lg leading-relaxed">
                {t}
              </p>
            ))}
          </div>
        </motion.section>
      ))}

      {/* SERVICIOS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-gray-900/70 border border-gray-800 rounded-3xl shadow-md p-8 md:p-12 w-full max-w-6xl mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-orange-400 text-center mb-10">¿Qué Ofrecemos?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {services.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-gray-950/70 rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.03]"
            >
              <div className="text-6xl mb-3 animate-bounce-slow">{item.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-100 mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <p className="text-gray-200 text-xl mb-8 md:text-2xl">
          ¿Listo para vivir la experiencia{" "}
          <strong className="text-orange-400">Puerto Rico Restobar</strong>?
        </p>

        <a
          href="/menu"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-xl inline-flex items-center gap-3"
        >
          Explorar Nuestro Menú
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </motion.div>
    </main>
  );
}

export default React.memo(AboutUs);
