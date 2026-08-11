import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  /**
   * Allow LAN / ngrok origins to hit the Next.js dev server
   * (avoids blocked cross-origin asset requests in Next 15+).
   * Page loads via http://<lan-ip>:1234 are same-origin; ngrok needs these.
   */
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.io",
    "*.ngrok.app",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
