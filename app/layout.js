// layout.js wraps every page: fonts, <html>, <body>, and things that run everywhere.
// Fonts are installed as packages (Fontsource), so they are served from your own site. Fast, and no Google calls.
import "@fontsource-variable/instrument-sans/wght.css";
import "@fontsource-variable/instrument-sans/wght-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/400-italic.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/800.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource-variable/google-sans-flex/wght.css";
import "@fontsource-variable/google-sans-code/wght.css";
import "@fontsource-variable/google-sans-code/wght-italic.css";
import DotField from "@/components/DotField";
import SmoothScroll from "@/components/SmoothScroll";
import { TwinProvider } from "@/components/Twin";
import "./globals.css";

const DESC = "Product Designer in Dublin. I design with AI and decide like a human: case studies, live prototypes and my process.";
export const metadata = {
  metadataBase: new URL("https://tanushkapadelkar.vercel.app"),
  title: "Tanushka Padelkar · Product Designer",
  description: DESC,
  openGraph: {
    title: "Tanushka Padelkar · Product Designer",
    description: DESC,
    url: "https://tanushkapadelkar.vercel.app",
    siteName: "Tanushka Padelkar",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Tanushka Padelkar, Product Designer who designs with AI and decides like a human" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Tanushka Padelkar · Product Designer", description: DESC, images: ["/og.png"] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <DotField />
          <TwinProvider>{children}</TwinProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
