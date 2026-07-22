import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wird — Daily Worship Companion",
    short_name: "Wird",
    description:
      "Adhkar with proof, the Quran, and authentic hadith — your daily wird.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b1120",
    theme_color: "#0e5c3a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
