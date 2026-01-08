import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "upload.wikimedia.org",
      "images.unsplash.com",
      "michimarketing.com",
      "picsum.photos",
      "i.ytimg.com",
      "cdn.openai.com",
      "placehold.co",
      "res.cloudinary.com",
      "drive.google.com",
    ],
  },

  env: {
    // ✅ ESTE ES EL QUE USA TODO TU FRONT
    NEXT_PUBLIC_API_URL:"http://127.0.0.1:8000/api",

    NEXT_PUBLIC_MP_PUBLIC_KEY:
      "APP_USR-ba1bb53f-827c-4c39-9e25-7716c4e57455",
    NEXT_PUBLIC_CULQI_PUBLIC_KEY:
      "pk_test_h6x1GXjwAYCK2fLD",

    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "tu_secreto_super_seguro_generalo_con_openssl",

    GOOGLE_CLIENT_ID:
      "702949617967-8oudu9l2hdkq6laqps0u23lc6i2oa0r6.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET:
      "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",

    FACEBOOK_CLIENT_ID: "tuappid",
    FACEBOOK_CLIENT_SECRET: "tusecreto",
  },
};

export default nextConfig;
