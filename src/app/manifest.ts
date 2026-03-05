import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Expense Budget Tracker",
    short_name: "Budget Tracker",
    description:
      "Open-source expense and budget tracker with multi-currency support.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#232323",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
