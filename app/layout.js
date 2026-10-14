// layout.js wraps every page: fonts, <html>, <body>, and things that run everywhere.
// Fonts are installed as packages (Fontsource), so they are served from your own site. Fast, and no Google calls.
import "@fontsource-variable/instrument-sans/wght.css";
import "@fontsource-variable/instrument-sans/wght-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/400-italic.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/800.css";
import SmoothScroll from "@/components/SmoothScroll";
import { TwinProvider } from "@/components/Twin";
import "./globals.css";

export const metadata = {
  title: "Tanushka Padelkar",
  description: "Tanushka Padelkar, Product Designer in Dublin. I design with AI and decide like a human.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <TwinProvider>{children}</TwinProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
