import type { Metadata } from "next"
import { JetBrains_Mono, Source_Serif_4 } from "next/font/google"

// Agents on Open Rails deck fonts.
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jbm", display: "swap" })
const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400"], variable: "--font-serif4", display: "swap" })

const title = "Builder Session · Stable Agents: LatAm IRL · Celo × Ripio"
const description =
  "Slides del workshop de la hackathon Agents on Open Rails: tracks, premios, stablecoins wFiat de Ripio, Celopedia, eve y cómo inscribirse en Loops House."

export const metadata: Metadata = { title, description, openGraph: { title, description, type: "website" } }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: "#0B0A0C" }} className={`${mono.variable} ${serif.variable}`}>
        {children}
      </body>
    </html>
  )
}
