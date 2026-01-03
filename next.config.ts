import { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  images: {
    domains: ['upload.wikimedia.org', 'images.unsplash.com', 
   "michimarketing.com", "picsum.photos", "i.ytimg.com","cdn.openai.com", "placehold.co","res.cloudinary.com", "drive.google.com"

    ],
  },


  

  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: "http://localhost:8000/api",
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:8000/api",
    NEXT_PUBLIC_MP_PUBLIC_KEY: "APP_USR-ba1bb53f-827c-4c39-9e25-7716c4e57455" ,
    NEXT_PUBLIC_CULQI_PUBLIC_KEY:"pk_test_h6x1GXjwAYCK2fLD"

  },



};






export default nextConfig;