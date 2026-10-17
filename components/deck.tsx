"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

/* Agents on Open Rails brand (from the official deck): near-black, white mono, Celo yellow for numbers,
   one color per track. JetBrains Mono for headlines, Source Serif 4 for the hackathon name. */
const BG = "#0B0A0C"
const YELLOW = "#FCFF52"
const GREEN = "#3DDC84"
const PURPLE = "#A98BFF"
const ORANGE = "#FF8A3D"

/* ---------- language: Spanish by default, English with ?lang=en ---------- */
type Lang = "es" | "en"
const LangCtx = createContext<Lang>("es")

/* ---------- builder sessions (all Saturday Oct 17, 18:00 to 20:00 ART) ---------- */
type Sede = { ciudad: string; host: string; lugar: string; dir: string; luma: string }
const SEDES: Sede[] = [
  { ciudad: "Salta", host: "artugrande", lugar: "SorboLabs", dir: "Deán Funes 244", luma: "https://luma.com/mb3e5jgc" },
  { ciudad: "Jujuy", host: "fdurandev", lugar: "MINTA Café & Coworking", dir: "Salta 1079", luma: "https://luma.com/u3o10dec" },
  { ciudad: "Córdoba", host: "joaquinggs", lugar: "Bithouse", dir: "José Roque Funes 1791", luma: "https://luma.com/mz2acha5" },
  { ciudad: "Rosario", host: "AleRepetto5", lugar: "Estación F", dir: "Av. Cándido Carballo 580", luma: "https://luma.com/67plbyg0" },
  { ciudad: "Buenos Aires", host: "ferminrp", lugar: "Café Nómada Villa Crespo", dir: "Malabia 806", luma: "https://luma.com/uoglp1bm" },
  { ciudad: "Mar del Plata", host: "celizin", lugar: "Mila Oficinas", dir: "Santiago del Estero 2151", luma: "https://luma.com/w66t9ko7" },
]

const TOKENS = [
  { s: "wARS", es: "Peso argentino", en: "Argentine peso", logo: "wars", addr: "0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d" },
  { s: "wBRL", es: "Real brasileño", en: "Brazilian real", logo: "wbrl", addr: "0xd76f5faf6888e24d9f04bf92a0c8b921fe4390e0" },
  { s: "wMXN", es: "Peso mexicano", en: "Mexican peso", logo: "wmxn", addr: "0x337e7456b420bd3481e7fa61fa9850343d610d34" },
  { s: "wCOP", es: "Peso colombiano", en: "Colombian peso", logo: "wcop", addr: "0x8a1d45e102e886510e891d2ec656a708991e2d76" },
  { s: "wPEN", es: "Sol peruano", en: "Peruvian sol", logo: "wpen", addr: "0x4F34c8b3b5FB6D98Da888F0feA543d4d9C9F2eBE" },
  { s: "wCLP", es: "Peso chileno", en: "Chilean peso", logo: "wclp", addr: "0x61D450a098b6a7f69fC4b98CE68198fe59768651" },
]

const QR_RAMP = { size: 29, d: "M2 2.5h7m2 0h3m1 0h1m2 0h1m1 0h7M2 3.5h1m5 0h1m3 0h2m1 0h4m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h2m4 0h2m2 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h3m2 0h1m4 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h3m1 0h2m2 0h1m1 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h1m1 0h6m2 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h5m2 0h1M2 10.5h1m1 0h5m6 0h4m1 0h5M2 11.5h2m1 0h2m3 0h2m1 0h1m4 0h1m2 0h1m3 0h1M2 12.5h1m2 0h7m1 0h1m1 0h1m1 0h2m1 0h1m1 0h2m1 0h2M6 13.5h2m2 0h4m2 0h2m1 0h2m5 0h1M2 14.5h1m1 0h1m2 0h5m3 0h2m2 0h4m1 0h3M2 15.5h1m7 0h2m2 0h2m2 0h1m2 0h1m1 0h1m1 0h1M2 16.5h1m3 0h1m1 0h2m1 0h1m3 0h3m1 0h1m1 0h3m1 0h2M2 17.5h1m2 0h1m4 0h3m1 0h1m1 0h1m2 0h4m3 0h1M2 18.5h1m1 0h1m1 0h4m1 0h2m1 0h9m1 0h1M10 19.5h1m1 0h1m2 0h1m2 0h1m3 0h2M2 20.5h7m4 0h2m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3M2 21.5h1m5 0h1m1 0h1m1 0h2m2 0h1m1 0h1m3 0h2M2 22.5h1m1 0h3m1 0h1m1 0h1m2 0h1m3 0h6m1 0h3M2 23.5h1m1 0h3m1 0h1m1 0h3m1 0h2m1 0h4m1 0h5M2 24.5h1m1 0h3m1 0h1m1 0h1m4 0h2m1 0h2m3 0h2m1 0h1M2 25.5h1m5 0h1m2 0h1m2 0h2m1 0h2m1 0h4m2 0h1M2 26.5h7m1 0h1m3 0h1m1 0h2m2 0h7" }
const QR_RIPIODOCS = { size: 29, d: "M2 2.5h7m2 0h1m2 0h2m2 0h1m1 0h7M2 3.5h1m5 0h1m2 0h1m1 0h1m1 0h4m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h5m1 0h2m2 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h6m4 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h1m2 0h1m1 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h2m1 0h5m2 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h2m2 0h1m2 0h1M2 10.5h1m1 0h5m2 0h1m2 0h5m1 0h5M2 11.5h1m2 0h1m4 0h1m1 0h3m3 0h1m2 0h1m3 0h1M2 12.5h1m5 0h1m1 0h2m3 0h1m1 0h3m3 0h1m1 0h2M3 13.5h3m4 0h3m1 0h1m1 0h2m1 0h1m1 0h1m4 0h1M5 14.5h4m3 0h1m2 0h2m2 0h2m1 0h1m1 0h3M2 15.5h1m1 0h2m3 0h2m1 0h1m1 0h2m2 0h1m2 0h1m1 0h1m1 0h1M2 16.5h1m1 0h1m1 0h1m1 0h1m1 0h2m3 0h3m2 0h4m1 0h2M2 17.5h1m1 0h4m1 0h1m1 0h2m1 0h1m1 0h1m2 0h1m1 0h2m3 0h1M2 18.5h1m2 0h2m1 0h1m1 0h1m1 0h1m1 0h9m1 0h1M10 19.5h2m3 0h1m2 0h1m3 0h2M2 20.5h7m4 0h2m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3M2 21.5h1m5 0h1m1 0h1m1 0h2m2 0h1m1 0h1m3 0h2M2 22.5h1m1 0h3m1 0h1m1 0h2m1 0h1m3 0h6m1 0h3M2 23.5h1m1 0h3m1 0h1m1 0h2m2 0h2m1 0h4m1 0h5M2 24.5h1m1 0h3m1 0h1m1 0h2m3 0h2m1 0h2m3 0h2m1 0h1M2 25.5h1m5 0h1m2 0h1m2 0h2m1 0h2m1 0h4m2 0h1M2 26.5h7m1 0h1m3 0h1m1 0h2m1 0h1m1 0h6" }
const QR_BRIDGE = { size: 29, d: "M2 2.5h7m4 0h1m2 0h1m1 0h1m1 0h7M2 3.5h1m5 0h1m4 0h1m3 0h2m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h1m2 0h1m3 0h1m2 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h1m2 0h4m3 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m4 0h1m2 0h1m1 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h1m3 0h1m2 0h1m2 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h5m1 0h1M2 10.5h1m1 0h5m6 0h4m1 0h5M2 11.5h3m7 0h1m2 0h1m2 0h2m1 0h1m3 0h1M5 12.5h1m1 0h4m1 0h1m1 0h4m2 0h1m1 0h2m1 0h2M9 13.5h1m4 0h1m1 0h1m1 0h1m7 0h1M3 14.5h1m1 0h5m1 0h3m1 0h1m3 0h2m1 0h1m1 0h3M2 15.5h4m3 0h1m4 0h2m5 0h1m1 0h1m1 0h1M2 16.5h1m2 0h2m1 0h1m3 0h1m2 0h4m2 0h3m1 0h2M2 17.5h1m1 0h1m5 0h3m1 0h1m2 0h6m3 0h1M2 18.5h1m3 0h1m1 0h1m2 0h2m1 0h9m1 0h1M10 19.5h1m1 0h1m4 0h2m3 0h2M2 20.5h7m3 0h4m2 0h1m1 0h1m1 0h1m1 0h3M2 21.5h1m5 0h1m1 0h4m2 0h1m1 0h1m3 0h2m2 0h1M2 22.5h1m1 0h3m1 0h1m1 0h2m1 0h10m1 0h1M2 23.5h1m1 0h3m1 0h1m1 0h2m2 0h2m2 0h3m1 0h5M2 24.5h1m1 0h3m1 0h1m1 0h1m4 0h2m6 0h2m1 0h1M2 25.5h1m5 0h1m2 0h1m4 0h8m2 0h1M2 26.5h7m1 0h1m2 0h4m3 0h7" }
const QR_FAUCET = { size: 37, d: "M2 2.5h7m3 0h3m3 0h6m1 0h2m1 0h7M2 3.5h1m5 0h1m4 0h2m1 0h2m1 0h1m3 0h2m1 0h1m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h1m1 0h3m2 0h2m2 0h4m3 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h5m3 0h4m2 0h1m3 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h1m2 0h1m1 0h3m2 0h1m2 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h3m4 0h4m3 0h1m3 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h2m2 0h1m1 0h3m3 0h2m2 0h1M2 10.5h1m1 0h5m4 0h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h1m1 0h5M2 11.5h1m3 0h2m3 0h2m1 0h2m2 0h4m1 0h1m1 0h1m2 0h2m1 0h2m1 0h1M3 12.5h1m1 0h5m1 0h1m3 0h3m1 0h1m2 0h1m4 0h1m2 0h1m1 0h2M5 13.5h3m3 0h1m1 0h1m1 0h1m1 0h1m4 0h3m2 0h1m2 0h3M4 14.5h2m1 0h2m1 0h2m1 0h2m1 0h2m1 0h1m4 0h1m1 0h2m1 0h3m1 0h1M2 15.5h3m2 0h1m2 0h4m1 0h1m2 0h6m1 0h1m2 0h1m4 0h2M2 16.5h4m1 0h3m3 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h1m1 0h3m1 0h4M3 17.5h5m1 0h3m1 0h2m3 0h1m3 0h4m1 0h2m2 0h2M2 18.5h1m2 0h1m2 0h1m2 0h2m1 0h2m2 0h2m4 0h1m2 0h1m1 0h2m3 0h1M7 19.5h1m1 0h1m3 0h2m1 0h1m1 0h6m1 0h1m2 0h2m1 0h4M2 20.5h3m1 0h3m4 0h1m2 0h2m5 0h2m4 0h2m1 0h2M3 21.5h1m1 0h1m1 0h1m2 0h3m1 0h4m4 0h4m2 0h6M2 22.5h1m3 0h1m1 0h1m3 0h2m3 0h1m1 0h1m1 0h1m2 0h3m3 0h2M2 23.5h1m1 0h1m2 0h1m3 0h1m1 0h1m1 0h2m1 0h5m1 0h2m1 0h2m2 0h1m2 0h1M2 24.5h1m1 0h1m1 0h1m1 0h1m3 0h2m2 0h2m4 0h1m1 0h1m5 0h2m1 0h1M2 25.5h1m4 0h1m4 0h1m3 0h1m1 0h1m2 0h1m1 0h3m1 0h2m1 0h4M2 26.5h1m1 0h3m1 0h2m3 0h4m1 0h3m3 0h7m2 0h2M10 27.5h1m1 0h2m1 0h1m2 0h1m1 0h4m2 0h1m3 0h1m1 0h1m1 0h1M2 28.5h7m2 0h1m2 0h1m2 0h2m1 0h1m1 0h5m1 0h1m1 0h1m1 0h2M2 29.5h1m5 0h1m1 0h1m5 0h2m3 0h3m1 0h2m3 0h5M2 30.5h1m1 0h3m1 0h1m1 0h2m3 0h1m1 0h1m1 0h1m6 0h6M2 31.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m2 0h5m3 0h2m2 0h2m1 0h2M2 32.5h1m1 0h3m1 0h1m1 0h2m3 0h1m1 0h3m2 0h1m1 0h2m2 0h2M2 33.5h1m5 0h1m2 0h1m1 0h3m1 0h1m3 0h4m5 0h1m1 0h1M2 34.5h7m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h1m2 0h1m1 0h4m3 0h1" }
const QR_ATTR = { size: 37, d: "M2 2.5h7m1 0h1m1 0h2m3 0h4m2 0h1m1 0h1m2 0h7M2 3.5h1m5 0h1m3 0h1m1 0h1m3 0h2m1 0h1m1 0h2m3 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m3 0h1m2 0h1m1 0h2m3 0h1m1 0h3m1 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h1m1 0h1m3 0h2m1 0h2m1 0h2m1 0h1m2 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h7m2 0h4m3 0h1m1 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h3m2 0h1m2 0h1m2 0h1m1 0h1m4 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h1m1 0h3m2 0h3m3 0h2M2 10.5h1m3 0h1m1 0h3m1 0h2m5 0h1m1 0h3m3 0h5m2 0h1M2 11.5h1m1 0h2m1 0h1m1 0h1m2 0h2m1 0h1m1 0h2m1 0h1m4 0h1m1 0h1m3 0h3M2 12.5h2m4 0h1m1 0h5m2 0h1m1 0h1m2 0h4m1 0h2m2 0h1m1 0h1M2 13.5h1m1 0h2m1 0h1m1 0h4m3 0h1m2 0h3m1 0h1m1 0h1m2 0h1m4 0h1M3 14.5h4m1 0h10m2 0h3m2 0h1m1 0h2m1 0h2m1 0h1M2 15.5h3m1 0h1m4 0h3m4 0h2m1 0h1m1 0h3m1 0h1m1 0h1m2 0h1M2 16.5h5m1 0h3m2 0h2m1 0h1m1 0h1m1 0h2m3 0h4m2 0h3M4 17.5h4m2 0h1m2 0h2m1 0h1m2 0h6m1 0h3M4 18.5h2m1 0h2m1 0h2m3 0h1m1 0h1m1 0h2m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1M2 19.5h1m1 0h4m1 0h1m2 0h1m1 0h1m2 0h1m1 0h2m2 0h1m1 0h1m1 0h1m3 0h3M3 20.5h1m1 0h1m2 0h2m1 0h2m1 0h1m2 0h1m2 0h1m1 0h1m2 0h1m1 0h3m1 0h1m1 0h1M2 21.5h3m1 0h1m4 0h3m7 0h2m1 0h4m1 0h1m4 0h1M2 22.5h1m1 0h1m1 0h3m1 0h3m1 0h2m2 0h1m5 0h1m1 0h1m1 0h1m1 0h2m1 0h2M2 23.5h3m1 0h1m2 0h2m2 0h1m2 0h1m2 0h4m2 0h1m3 0h1m1 0h3M7 24.5h4m2 0h1m2 0h2m1 0h2m1 0h1m1 0h4m2 0h1m2 0h1M9 25.5h2m2 0h1m3 0h4m2 0h1m1 0h1m1 0h3M2 26.5h8m3 0h2m4 0h1m1 0h4m1 0h6M10 27.5h1m1 0h4m1 0h2m1 0h1m1 0h1m2 0h2m3 0h1m1 0h1M2 28.5h7m1 0h1m1 0h1m1 0h1m2 0h3m2 0h3m1 0h1m1 0h1m1 0h2m1 0h1M2 29.5h1m5 0h1m2 0h2m1 0h1m1 0h1m1 0h3m1 0h2m2 0h1m3 0h1M2 30.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h1m4 0h1m1 0h1m3 0h6m2 0h1M2 31.5h1m1 0h3m1 0h1m5 0h3m1 0h2m1 0h1m1 0h4m1 0h6M2 32.5h1m1 0h3m1 0h1m2 0h1m1 0h3m2 0h1m1 0h2m3 0h2m1 0h4M2 33.5h1m5 0h1m3 0h1m1 0h1m1 0h1m2 0h5m1 0h3M2 34.5h7m1 0h1m2 0h1m2 0h4m2 0h7m5 0h1" }
const QR_ERC8004 = { size: 37, d: "M2 2.5h7m3 0h1m1 0h2m2 0h1m1 0h2m1 0h1m1 0h1m2 0h7M2 3.5h1m5 0h1m2 0h3m1 0h4m1 0h1m1 0h3m1 0h1m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h1m4 0h1m2 0h1m1 0h4m1 0h1m2 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h1m1 0h1m5 0h2m2 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h1m1 0h8m2 0h1m5 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h1m1 0h2m3 0h1m3 0h1m1 0h2m1 0h1M2 10.5h1m1 0h5m3 0h1m1 0h2m1 0h1m1 0h1m4 0h3m1 0h5M2 11.5h1m3 0h2m2 0h4m4 0h1m1 0h3m2 0h2m1 0h2m1 0h2m1 0h1M2 12.5h1m2 0h4m2 0h1m2 0h1m2 0h2m1 0h1m2 0h1m4 0h1m1 0h1m1 0h2M2 13.5h2m1 0h2m2 0h6m1 0h3m1 0h2m1 0h1m1 0h3m2 0h4M3 14.5h3m1 0h2m3 0h3m5 0h1m1 0h1m3 0h2m1 0h3m1 0h1M3 15.5h1m1 0h3m1 0h1m3 0h1m1 0h4m1 0h1m2 0h1m1 0h1m2 0h1m2 0h1m1 0h2M2 16.5h2m1 0h1m1 0h5m7 0h2m2 0h2m2 0h2m3 0h2M4 17.5h1m2 0h1m3 0h1m1 0h3m2 0h1m1 0h1m2 0h3m1 0h2m2 0h2M2 18.5h2m4 0h1m1 0h1m1 0h1m3 0h1m2 0h1m2 0h1m1 0h1m2 0h1m1 0h2m3 0h1M4 19.5h1m1 0h2m3 0h2m1 0h2m3 0h1m1 0h2m2 0h1m2 0h2m1 0h2m1 0h1M3 20.5h2m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1m2 0h3m2 0h4m1 0h2M2 21.5h6m1 0h2m3 0h2m1 0h10m2 0h6M3 22.5h2m2 0h6m1 0h2m1 0h2m2 0h2m1 0h1m2 0h1m2 0h2M2 23.5h5m3 0h1m1 0h1m4 0h1m2 0h1m4 0h1m2 0h1m2 0h1m2 0h1M2 24.5h1m4 0h4m1 0h3m1 0h3m3 0h3m2 0h1m1 0h3m1 0h1M2 25.5h1m3 0h1m2 0h4m2 0h3m3 0h3m5 0h1m2 0h1m1 0h1M2 26.5h1m1 0h1m1 0h1m1 0h5m2 0h3m1 0h1m1 0h1m2 0h7M10 27.5h1m3 0h1m3 0h1m1 0h4m2 0h1m3 0h1m1 0h1m1 0h1M2 28.5h7m2 0h2m1 0h2m1 0h1m2 0h1m2 0h1m1 0h2m1 0h1m1 0h1m1 0h2M2 29.5h1m5 0h1m1 0h2m1 0h1m1 0h4m2 0h6m3 0h4M2 30.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h1m4 0h2m2 0h1m1 0h6m1 0h2M2 31.5h1m1 0h3m1 0h1m1 0h6m1 0h3m1 0h1m3 0h1m1 0h1m2 0h2m1 0h2M2 32.5h1m1 0h3m1 0h1m1 0h3m1 0h1m5 0h1m1 0h1m1 0h2m2 0h2m1 0h1M2 33.5h1m5 0h1m3 0h2m1 0h2m1 0h1m4 0h2m2 0h1m2 0h3M2 34.5h7m1 0h1m3 0h3m2 0h1m1 0h1m4 0h1m2 0h1m3 0h1" }

const QR_AL_REPO = { size: 33, d: "M2 2.5h7m2 0h1m2 0h2m2 0h1m2 0h2m1 0h7M2 3.5h1m5 0h1m3 0h1m4 0h2m5 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h4m2 0h1m5 0h1m1 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h4m1 0h3m1 0h1m2 0h1m1 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m1 0h2m4 0h1m1 0h3m1 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h1m1 0h2m3 0h1m1 0h1m4 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h5m1 0h1m1 0h1m2 0h1M2 10.5h1m1 0h5m2 0h1m2 0h1m4 0h1m2 0h1m1 0h5M2 11.5h1m1 0h1m1 0h1m2 0h1m1 0h1m1 0h3m2 0h1m2 0h2m1 0h3m3 0h1M2 12.5h1m2 0h2m1 0h1m2 0h1m3 0h6m1 0h1m3 0h1M2 13.5h4m1 0h1m6 0h2m1 0h1m2 0h1m6 0h1m1 0h1M2 14.5h2m1 0h1m1 0h2m1 0h3m3 0h2m1 0h1m7 0h2M2 15.5h1m2 0h2m11 0h1m1 0h7m3 0h1M3 16.5h4m1 0h3m3 0h1m2 0h2m1 0h1m1 0h2m2 0h3M4 17.5h3m3 0h2m2 0h1m1 0h1m4 0h6m2 0h1M2 18.5h3m1 0h3m1 0h4m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2M2 19.5h3m1 0h2m1 0h2m4 0h2m1 0h4m1 0h4m1 0h1m1 0h1M2 20.5h1m2 0h2m1 0h10m1 0h1m2 0h1m1 0h3m1 0h1M2 21.5h1m2 0h1m3 0h1m1 0h1m2 0h2m1 0h2m1 0h1m1 0h3m4 0h1M2 22.5h1m1 0h2m2 0h2m1 0h3m2 0h1m2 0h1m1 0h6m1 0h3M10 23.5h2m6 0h1m1 0h1m1 0h1m3 0h5M2 24.5h7m4 0h2m2 0h2m2 0h2m1 0h1m1 0h3M2 25.5h1m5 0h1m1 0h3m1 0h1m1 0h2m2 0h3m3 0h1m2 0h2M2 26.5h1m1 0h3m1 0h1m1 0h1m2 0h2m2 0h1m1 0h1m2 0h5m1 0h1M2 27.5h1m1 0h3m1 0h1m1 0h1m3 0h1m1 0h1m1 0h1m1 0h3m4 0h4M2 28.5h1m1 0h3m1 0h1m1 0h1m1 0h1m3 0h3m2 0h9M2 29.5h1m5 0h1m4 0h2m1 0h1m1 0h1m3 0h2m1 0h1m1 0h1m1 0h1M2 30.5h7m1 0h4m1 0h1m3 0h3m2 0h3m1 0h1" }
const QR_AL_WEB = { size: 33, d: "M2 2.5h7m6 0h3m3 0h2m1 0h7M2 3.5h1m5 0h1m4 0h1m1 0h5m4 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m1 0h1m2 0h3m1 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h2m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m2 0h1m3 0h2m1 0h2m2 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h1m1 0h1m9 0h1m1 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h1m1 0h2m2 0h1m1 0h1m2 0h2M2 10.5h1m1 0h5m9 0h2m1 0h1m2 0h5M3 11.5h2m4 0h2m1 0h1m1 0h4m3 0h6m3 0h1M3 12.5h1m1 0h1m2 0h1m3 0h9m3 0h3M3 13.5h1m3 0h1m1 0h4m1 0h2m1 0h1m2 0h1m1 0h3m1 0h2m1 0h1M4 14.5h1m1 0h7m3 0h2m1 0h1m1 0h1m5 0h2M2 15.5h2m2 0h1m4 0h4m2 0h2m1 0h7m3 0h1M3 16.5h2m1 0h1m1 0h2m1 0h1m1 0h1m5 0h2m1 0h2m1 0h1m1 0h2M4 17.5h1m5 0h2m1 0h2m1 0h1m1 0h1m3 0h1m1 0h1m1 0h1m2 0h1M3 18.5h1m1 0h1m2 0h2m3 0h2m4 0h1m7 0h2M2 19.5h1m1 0h1m1 0h1m2 0h1m1 0h2m2 0h3m2 0h7m1 0h1m1 0h1M2 20.5h1m1 0h1m3 0h1m1 0h1m2 0h1m1 0h3m4 0h3m1 0h1m1 0h1M2 21.5h1m2 0h3m3 0h1m3 0h1m1 0h1m3 0h1m3 0h1m3 0h1M2 22.5h1m2 0h1m1 0h2m5 0h1m1 0h4m2 0h5m1 0h3M10 23.5h1m2 0h2m3 0h3m1 0h1m3 0h5M2 24.5h7m3 0h3m2 0h1m3 0h2m1 0h1m1 0h3M2 25.5h1m5 0h1m1 0h2m1 0h1m2 0h2m2 0h3m3 0h1m2 0h1M2 26.5h1m1 0h3m1 0h1m1 0h1m1 0h1m4 0h4m1 0h5m1 0h2M2 27.5h1m1 0h3m1 0h1m1 0h3m3 0h1m1 0h4m5 0h4M2 28.5h1m1 0h3m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3m1 0h9M2 29.5h1m5 0h1m4 0h3m1 0h1m2 0h1m1 0h2m1 0h3m1 0h1M2 30.5h7m1 0h2m4 0h2m1 0h1m6 0h1m1 0h1" }
const QR_AL_SPEC = { size: 37, d: "M2 2.5h7m2 0h1m2 0h2m2 0h1m1 0h4m1 0h1m2 0h7M2 3.5h1m5 0h1m4 0h5m5 0h1m2 0h1m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h1m1 0h2m2 0h6m1 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m2 0h1m1 0h1m1 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m1 0h2m3 0h1m2 0h3m2 0h1m2 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h4m2 0h5m3 0h1m3 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h2m1 0h2m2 0h1m5 0h4M2 10.5h1m1 0h5m2 0h7m1 0h1m4 0h1m3 0h5M2 11.5h1m2 0h1m1 0h1m5 0h1m4 0h1m1 0h2m3 0h1m2 0h2m1 0h4M2 12.5h1m4 0h2m3 0h3m2 0h4m1 0h1m1 0h1m2 0h2m1 0h1m1 0h2M2 13.5h1m2 0h3m1 0h1m2 0h3m1 0h2m4 0h2m3 0h2m1 0h4M2 14.5h1m1 0h1m3 0h4m1 0h2m4 0h2m1 0h1m1 0h1m1 0h2m1 0h3m1 0h2M6 15.5h2m1 0h1m2 0h12m1 0h1m2 0h1m3 0h3M3 16.5h1m4 0h1m5 0h1m1 0h1m2 0h1m2 0h1m1 0h1m1 0h3m2 0h1m1 0h1M2 17.5h1m2 0h1m3 0h1m2 0h1m1 0h2m2 0h1m2 0h1m1 0h2m2 0h6M2 18.5h4m1 0h2m5 0h1m1 0h1m2 0h1m4 0h2m1 0h1m1 0h2m3 0h1M2 19.5h6m1 0h1m1 0h1m2 0h1m3 0h8m2 0h2m1 0h2m1 0h1M2 20.5h1m2 0h2m1 0h1m1 0h4m1 0h1m1 0h3m6 0h5m1 0h1M3 21.5h1m1 0h2m2 0h2m2 0h1m1 0h4m1 0h1m1 0h3m3 0h5m1 0h1M5 22.5h8m1 0h1m1 0h2m1 0h1m2 0h1m1 0h1m1 0h1m2 0h3M2 23.5h2m5 0h1m1 0h1m3 0h1m1 0h1m1 0h1m1 0h3m1 0h1m2 0h1m2 0h2m1 0h1M2 24.5h1m1 0h3m1 0h1m5 0h1m1 0h2m4 0h1m7 0h4M2 25.5h1m1 0h3m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m3 0h2m2 0h2m1 0h1m1 0h2m1 0h1M2 26.5h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h1m1 0h5m2 0h1m1 0h6m2 0h1M10 27.5h2m1 0h1m4 0h1m1 0h3m2 0h2m3 0h1m1 0h3M2 28.5h7m2 0h2m1 0h2m1 0h1m2 0h1m2 0h1m1 0h2m1 0h1m1 0h1m1 0h2M2 29.5h1m5 0h1m1 0h2m1 0h3m4 0h7m3 0h4M2 30.5h1m1 0h3m1 0h1m1 0h3m3 0h2m1 0h1m1 0h1m2 0h1m1 0h6m1 0h1M2 31.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h2m1 0h4m1 0h1m3 0h1m2 0h1m1 0h3M2 32.5h1m1 0h3m1 0h1m1 0h2m1 0h1m3 0h1m1 0h1m2 0h2m2 0h4m1 0h1M2 33.5h1m5 0h1m5 0h1m1 0h3m4 0h2m2 0h2m1 0h3M2 34.5h7m1 0h2m5 0h1m1 0h1m4 0h6m1 0h1m1 0h1" }
const QR_AL_HOW = { size: 37, d: "M2 2.5h7m6 0h1m2 0h4m3 0h1m2 0h7M2 3.5h1m5 0h1m2 0h1m3 0h3m1 0h1m2 0h1m1 0h1m1 0h1m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h4m1 0h1m2 0h6m1 0h1m2 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h2m1 0h3m1 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m6 0h1m1 0h2m2 0h1m1 0h1m2 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h1m3 0h1m2 0h3m2 0h1m5 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h2m1 0h1m2 0h2m2 0h1m2 0h3M2 10.5h1m1 0h5m2 0h1m1 0h5m1 0h1m4 0h3m1 0h5M2 11.5h1m1 0h2m3 0h1m6 0h1m4 0h3m1 0h1m2 0h2m1 0h2m1 0h1M3 12.5h2m1 0h1m1 0h1m2 0h4m2 0h1m2 0h1m2 0h1m3 0h1m2 0h1m1 0h2M2 13.5h1m1 0h1m1 0h1m2 0h1m1 0h2m1 0h1m1 0h3m3 0h3m1 0h1m1 0h1m1 0h5M3 14.5h4m1 0h3m2 0h2m5 0h2m1 0h1m2 0h2m1 0h3m1 0h2M4 15.5h1m1 0h1m6 0h6m3 0h1m2 0h1m1 0h2m3 0h3M5 16.5h4m10 0h1m1 0h1m1 0h1m3 0h2m2 0h1m1 0h1M2 17.5h1m8 0h1m1 0h3m2 0h1m1 0h5m1 0h3m1 0h3M4 18.5h1m2 0h2m2 0h1m1 0h4m2 0h1m1 0h1m2 0h4m1 0h2m3 0h1M2 19.5h2m1 0h1m3 0h3m4 0h1m1 0h5m2 0h1m2 0h2m1 0h2m1 0h1M7 20.5h4m2 0h1m2 0h4m2 0h1m1 0h1m2 0h1m1 0h2m1 0h1M2 21.5h2m3 0h1m1 0h1m2 0h2m3 0h4m1 0h1m2 0h3m1 0h4M3 22.5h3m2 0h1m1 0h2m1 0h2m1 0h3m3 0h3m1 0h2m1 0h3M2 23.5h2m1 0h1m3 0h2m1 0h4m1 0h1m2 0h1m2 0h1m1 0h1m2 0h2m1 0h1m2 0h1M2 24.5h1m2 0h1m2 0h1m1 0h2m1 0h1m1 0h4m3 0h2m6 0h2m1 0h1M2 25.5h1m1 0h2m3 0h3m1 0h1m1 0h1m1 0h1m5 0h5m2 0h3m1 0h1M2 26.5h1m1 0h2m2 0h1m1 0h2m5 0h1m1 0h1m6 0h5m2 0h2M10 27.5h1m1 0h5m1 0h1m2 0h3m2 0h1m3 0h1m1 0h3M2 28.5h7m2 0h2m4 0h2m1 0h1m1 0h2m1 0h2m1 0h1m1 0h1m1 0h2M2 29.5h1m5 0h1m1 0h2m2 0h1m1 0h1m4 0h1m1 0h4m3 0h3M2 30.5h1m1 0h3m1 0h1m1 0h5m2 0h1m2 0h1m2 0h1m2 0h6M2 31.5h1m1 0h3m1 0h1m1 0h3m2 0h4m3 0h1m1 0h1m1 0h2m2 0h2m2 0h1M2 32.5h1m1 0h3m1 0h1m1 0h2m1 0h3m3 0h3m1 0h3m2 0h2m1 0h2M2 33.5h1m5 0h1m6 0h2m1 0h1m1 0h5m2 0h2m1 0h3M2 34.5h7m1 0h2m1 0h1m2 0h1m2 0h1m1 0h1m2 0h3m1 0h2m3 0h1" }

const AGENDA: { h: string; min: number; es: [string, string | string[]]; en: [string, string | string[]] }[] = [
  {
    h: "18:00",
    min: 15,
    es: ["Llegada y café", "Llegá, pedite un café y saludá."],
    en: ["Arrival and coffee", "Arrive, grab a coffee and say hi."],
  },
  {
    h: "18:15",
    min: 45,
    es: [
      "Keynote",
      [
        "Los tracks de la hackathon",
        "¿Qué es Celo?",
        "¿Qué son las stablecoins wFiat de Ripio?",
        "El stack: Celopedia y eve, el framework de agentes de Vercel",
        "Demo en vivo de un agente en mainnet",
        "Cómo inscribirte en la hackathon",
      ],
    ],
    en: [
      "Keynote",
      [
        "Hackathon tracks",
        "What is Celo?",
        "What are Ripio's wFiat stablecoins?",
        "The dev stack: Celopedia and eve, Vercel's agent framework",
        "Live demo of an agent on mainnet",
        "How to sign up for the hackathon",
      ],
    ],
  },
  {
    h: "19:00",
    min: 60,
    es: ["Arrancá ahora", "La mejor oportunidad para empezar, encontrar el mejor equipo y ponerte a codear."],
    en: ["Get started now", "The best chance to begin, find the best team and start coding."],
  },
]

const PROMPT_AGENTE: Record<Lang, string> = {
  es: `Quiero construir un agente para la hackathon Agents on Open Rails, track "Stable Agents: LatAm" (Ripio × Celo).

Contexto:
- Framework: eve de Vercel. Leé la documentación en https://eve.dev/llms.txt antes de empezar.
- Blockchain: Celo mainnet. Usá la skill de Celopedia para direcciones, viem y fee abstraction.
- Moneda: wARS de Ripio, 0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d (18 decimales).
- Cada transacción tiene que llevar mi attribution tag (ERC-8021, SDK: github.com/celo-org/attribution-tags).
- El agente necesita identidad ERC-8004 registrada desde su propia wallet.

Idea: [contá acá qué problema resuelve tu agente y para quién].

Primero proponé la arquitectura y los pasos. Después armá el proyecto y explicame cómo correrlo y deployarlo en Vercel.`,
  en: `I want to build an agent for the Agents on Open Rails hackathon, "Stable Agents: LatAm" track (Ripio × Celo).

Context:
- Framework: eve by Vercel. Read the docs at https://eve.dev/llms.txt before starting.
- Blockchain: Celo mainnet. Use the Celopedia skill for addresses, viem and fee abstraction.
- Currency: Ripio's wARS, 0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d (18 decimals).
- Every transaction must carry my attribution tag (ERC-8021, SDK: github.com/celo-org/attribution-tags).
- The agent needs an ERC-8004 identity registered from its own wallet.

Idea: [describe the problem your agent solves and for whom].

First propose the architecture and the steps. Then scaffold the project and explain how to run it and deploy it on Vercel.`,
}

/* Everything a coding agent needs to start the hackathon (copied by the "Copy prompt" button). */
const PROMPT_LLM: Record<Lang, string> = {
  es: `Sos mi copiloto para la hackathon "Agents on Open Rails" de Celo. Usá este contexto para ayudarme a elegir un track, diseñar el agente y construirlo. Antes de escribir código, haceme las preguntas que necesites sobre mi idea y mi experiencia.

# La hackathon
- Agentes que cobran, pagan y liquidan en rieles de pago reales, con plata real.
- Online, en Loops House: https://www.loops.house/agents-on-open-rails
- Inscripción y entrega hasta el lunes 9 de noviembre de 2026, 09:00 GMT (06:00 hora argentina). Ganadores: viernes 13 de noviembre.
- Premios: US$5.000 en CELO en total. Solo Celo mainnet (tener testnet en el repo está bien).
- Builder sessions presenciales el sábado 17/10, de 18 a 20 (hora argentina), en Salta, Jujuy, Córdoba, Rosario, Buenos Aires y Mar del Plata.

# Tracks
1. Stable Agents: LatAm (Ripio × Celo Core Co.). 1ro US$1.500, 2do US$500.
   Agentes que cobran, pagan, ahorran y liquidan en las stablecoins locales de Ripio (wARS, wBRL, wMXN, wCOP, wPEN, wCLP), sin pasar por el dólar.
   Se evalúa: funciona en mainnet con un token wFiat real; usa en serio wFiat y el stack de Celo; el agente es autónomo y útil; una persona real puede usarlo; el impacto en LatAm es claro.
2A. Open Corridors: Textile FX. 1ro US$750, 2do US$250.
   Agentes que cotizan y liquidan FX en Textile, mercado de cambio onchain y permissionless (cNGN, wARS, wBRL y USDC contra USD₮): https://app.textilecredit.com
   Se evalúa: P&L de la estrategia, volumen cotizado y ejecutado, originalidad.
2B. Open Corridors: USA₮ con x402. 1ro US$750, 2do US$250.
   Productos con usuarios reales que liquidan USA₮ con el facilitador x402 de Celo.
   Se evalúa: liquidación real entre partes independientes y que la moneda elegida se justifique por el usuario al que sirve.
   Usuario independiente: wallet que no es tuya, que no fondeaste vos ni tu financiador principal, y con actividad propia en Celo antes de la hackathon.
3. Build with buy (usebuy.ai). US$1.000 repartidos entre 5 proyectos.
   Productos que resuelven un problema real pagando por servicios que no son suyos (cómputo, browsers, datos, inferencia).
   Se evalúa: el problema, la profundidad de la integración (llamadas pagas verificadas a servicios que no controlás) y el crecimiento que les genera. Spamear la llamada más barata no suma.
Se puede participar en varios tracks, pero un equipo gana como máximo un premio por track. Si el proyecto no encaja en ninguno, entrá en el más cercano y explicá por qué.

# Reglas obligatorias (sin esto el proyecto no suma)
- Celo mainnet (chain id 42220).
- Repo público en GitHub desde la inscripción y accesible hasta el juzgamiento. Código escrito durante la hackathon. Cualquier framework de agentes vale.
- Attribution tag: código ERC-8021 que se agrega al calldata de CADA transacción, en el cliente de la wallet (frontend o backend del agente), no en el contrato. Te lo dan al inscribirte. Lo que se manda sin tag no se acredita después. SDK: https://github.com/celo-org/attribution-tags
- Identidad ERC-8004 del agente, registrada desde la wallet del agente antes del cierre (todos los tracks). Docs: https://docs.celo.org/build-on-celo/build-with-ai/8004 · Explorer: https://8004scan.io
- Si un relayer tuyo paga el gas, no cuenta como aporte del builder: explicalo en la entrega.

# Cómo inscribirse y enviar
1. Entrá a https://www.loops.house/agents-on-open-rails, tocá "Enroll now" e iniciá sesión. Ahí recibís tu attribution tag.
2. Instalá la skill de la hackathon en tu coding agent (Node 20.12+): npx loopshouse add agents-on-open-rails
3. Etiquetá cada transacción y agregá la wallet del agente a tu entry.
4. Registrá la identidad ERC-8004 y enviá antes del cierre.

# Stack recomendado
- Celopedia, la skill de Celo para coding agents (Claude Code, Codex, OpenClaw): npx skills add celo-org/celopedia-skills · https://celopedia.celo.org (en Claude Code, además: mkdir -p .claude && ln -s ../.agents/skills .claude/skills)
- eve, el framework de agentes open source (Apache-2.0) de Vercel, en beta (Node 24+): npx eve@latest init mi-agente, después cd mi-agente && npm run dev. Un agente es una carpeta: agent/instructions.md, agent.ts (modelo), skills/*.md, tools/*.ts, channels/, schedules/. Docs para coding agents: https://eve.dev/llms.txt
- Celo: L2 de Ethereum, bloques de 1 segundo, gas promedio de US$0.0005, gas pagable en stablecoins, por ejemplo USD₮ y USDC (fee abstraction). Docs: https://docs.celo.org

# Recursos de Ripio (wFiat)
Misma dirección en Celo y en las demás cadenas EVM. Todos con 18 decimales.
- wARS: 0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d
- wBRL: 0xd76f5faf6888e24d9f04bf92a0c8b921fe4390e0
- wMXN: 0x337e7456b420bd3481e7fa61fa9850343d610d34
- wCOP: 0x8a1d45e102e886510e891d2ec656a708991e2d76
- wPEN: 0x4F34c8b3b5FB6D98Da888F0feA543d4d9C9F2eBE
- wCLP: 0x61D450a098b6a7f69fC4b98CE68198fe59768651
On/off-ramp sin credenciales (lo más fácil): armá una URL de https://ramp.ripio.com ("/" on-ramp, "/offramp" off-ramp). Con country, chain, token y amount el usuario saltea el formulario; address es la wallet de destino. Ejemplo: https://ramp.ripio.com/?country=AR&chain=42220&token=WARS&amount=10000&address=0x...
Ramps API (solo empresas, KYB en https://platform.ripio.com): https://docs.ripio.com
Bridge: https://bridge.ripio.com (developers: https://bridge.ripio.com/developers)

# x402 en Celo
- Facilitador hosteado: https://api.x402.celo.org (endpoints /verify, /settle con API key, /supported, /health). Dashboard: https://x402.celo.org
- Liquida con EIP-3009 (USDC, USD₮, USA₮) y permit2 (wARS, wBRL, wCOP). El facilitador paga el gas. Consultá los tokens con: curl -s https://api.x402.celo.org/supported
- USA₮ en Celo: 0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771 (6 decimales).
- Servidor: npm i @x402/express @x402/core @x402/evm. Usá un objeto price explícito con la dirección del asset. Docs: https://docs.celo.org/build-on-celo/build-with-ai/x402

# buy (usebuy.ai)
- Marketplace donde los agentes compran servicios por HTTP pagando con x402 en Celo: VMs, browsers, datos de redes y web, RPC de Celo vía Chainstack, indexación con SQD, inferencia. El gateway paga el gas. Está en beta y los pagos son finales.
- npm install -g @celo/buy · buy setup --name mi-agente · buy mcp install --client all
- Llamada paga con tope: buy curl --max-amount 0.005 <url del gateway>
- Skill: https://github.com/celo-org/buy-skill

# USA₮ gratis
- Faucet de Google Cloud Web3 en Celo mainnet, con verificación única de Self: https://cloud.google.com/application/web3/faucet/celo/mainnet

# Ejemplo de referencia
- Alcancía, agente de ahorro en wARS/wBRL que aplica a los tracks 1, 2A y 3: https://alcancia-celo.vercel.app · repo: https://github.com/artugrande/alcancia · cómo funciona: https://alcancia-celo.vercel.app/como-funciona · demo: https://alcancia-celo.vercel.app/demo.mp4

# Ayuda
- Telegram de la hackathon (escribí en inglés): https://t.me/realworldagentshackathon
- Office hours: jueves 12:00 GMT (09:00 hora argentina).
- Chainstack: 3 meses del plan Growth gratis por equipo (https://chainstack.com). Grants después de la hackathon: https://www.prezenti.xyz
- Bridges a Celo: https://docs.celo.org/tooling/bridges/bridges

Cuando propongas el proyecto: decime qué track conviene y por qué, la arquitectura, cómo cumple las reglas obligatorias (attribution tag, ERC-8004, mainnet) y los primeros pasos para tener algo funcionando hoy.`,
  en: `You are my copilot for Celo's "Agents on Open Rails" hackathon. Use this context to help me pick a track, design the agent and build it. Before writing any code, ask me whatever you need about my idea and my experience.

# The hackathon
- Agents that earn, pay and settle on live payment rails, with real money moving.
- Online, on Loops House: https://www.loops.house/agents-on-open-rails
- Registration and submission deadline: Monday, November 9, 2026, 09:00 GMT. Winners announced Friday, November 13.
- Prizes: US$5,000 in CELO in total. Celo mainnet only (testnet references in the repo are fine).
- In-person builder sessions on Saturday Oct 17, 6 to 8 PM (Argentina time), in Salta, Jujuy, Córdoba, Rosario, Buenos Aires and Mar del Plata.

# Tracks
1. Stable Agents: LatAm (Ripio × Celo Core Co.). 1st US$1,500, 2nd US$500.
   Agents that charge, pay, save and settle in Ripio's local currency stablecoins (wARS, wBRL, wMXN, wCOP, wPEN, wCLP), without going through the dollar.
   Judged on: works on mainnet with a real wFiat token; real use of wFiat and the Celo stack; the agent is autonomous and useful; a real person can use the UX; clear LatAm impact.
2A. Open Corridors: Textile FX. 1st US$750, 2nd US$250.
   Agents that quote and settle FX on Textile, a permissionless onchain FX marketplace (cNGN, wARS, wBRL and USDC against USD₮): https://app.textilecredit.com
   Judged on: strategy P&L, volume quoted and filled, originality.
2B. Open Corridors: USA₮ with x402. 1st US$750, 2nd US$250.
   Products with real users settling USA₮ through Celo's x402 facilitator.
   Judged on: real settlement between independent parties, with the currency choice justified by the user it serves.
   Independent user: a wallet that isn't yours, wasn't first funded by you or your main funder, and had its own Celo activity before the hackathon started.
3. Build with buy (usebuy.ai). US$1,000 across 5 projects.
   Products that solve a real problem by paying for services they don't own (compute, browsers, data, inference).
   Judged on: the problem solved, integration depth (verified paid calls into services you don't control) and the growth they create for those services. Spamming the cheapest call scores nothing.
You can enter multiple tracks, but a team can win only one prize per track. If your project fits no track, enter the closest one and explain why.

# Mandatory rules (without these the project doesn't count)
- Celo mainnet (chain id 42220).
- Public GitHub repo from registration that still resolves at judging. Code written during the hackathon. Any agent framework is allowed.
- Attribution tag: an ERC-8021 code appended to the calldata of EVERY transaction, where your wallet client is built (frontend or agent backend), not in your smart contract. You get it when you enroll. Transactions sent without it can't be credited later. SDK: https://github.com/celo-org/attribution-tags
- ERC-8004 agent identity, registered from the agent's wallet before the deadline (every track). Docs: https://docs.celo.org/build-on-celo/build-with-ai/8004 · Explorer: https://8004scan.io
- Gas sponsored by your own relayer doesn't count as builder contribution: describe that architecture in your submission.

# How to enroll and submit
1. Go to https://www.loops.house/agents-on-open-rails, click "Enroll now" and log in. Your attribution tag is issued there.
2. Install the hackathon skill into your coding agent (Node 20.12+): npx loopshouse add agents-on-open-rails
3. Tag every transaction and add your agent's wallet to your entry.
4. Register the ERC-8004 identity and submit before the deadline.

# Recommended stack
- Celopedia, Celo's skill for coding agents (Claude Code, Codex, OpenClaw): npx skills add celo-org/celopedia-skills · https://celopedia.celo.org (for Claude Code, also: mkdir -p .claude && ln -s ../.agents/skills .claude/skills)
- eve, Vercel's open-source (Apache-2.0) agent framework, in beta (Node 24+): npx eve@latest init my-agent, then cd my-agent && npm run dev. An agent is a directory: agent/instructions.md, agent.ts (model), skills/*.md, tools/*.ts, channels/, schedules/. Docs for coding agents: https://eve.dev/llms.txt
- Celo: Ethereum L2, 1-second blocks, US$0.0005 average gas, gas payable in stablecoins, for example USD₮ and USDC (fee abstraction). Docs: https://docs.celo.org

# Ripio resources (wFiat)
Same address on Celo and every other EVM chain. All use 18 decimals.
- wARS: 0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d
- wBRL: 0xd76f5faf6888e24d9f04bf92a0c8b921fe4390e0
- wMXN: 0x337e7456b420bd3481e7fa61fa9850343d610d34
- wCOP: 0x8a1d45e102e886510e891d2ec656a708991e2d76
- wPEN: 0x4F34c8b3b5FB6D98Da888F0feA543d4d9C9F2eBE
- wCLP: 0x61D450a098b6a7f69fC4b98CE68198fe59768651
On/off-ramp with no credentials (easiest): build a https://ramp.ripio.com URL ("/" on-ramp, "/offramp" off-ramp). With country, chain, token and amount the user skips the form; address is the destination wallet. Example: https://ramp.ripio.com/?country=AR&chain=42220&token=WARS&amount=10000&address=0x...
Ramps API (companies only, KYB at https://platform.ripio.com): https://docs.ripio.com
Bridge: https://bridge.ripio.com (developers: https://bridge.ripio.com/developers)

# x402 on Celo
- Hosted facilitator: https://api.x402.celo.org (endpoints /verify, /settle with API key, /supported, /health). Dashboard: https://x402.celo.org
- Settles with EIP-3009 (USDC, USD₮, USA₮) and permit2 (wARS, wBRL, wCOP). The facilitator pays the gas. List tokens with: curl -s https://api.x402.celo.org/supported
- USA₮ on Celo: 0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771 (6 decimals).
- Server: npm i @x402/express @x402/core @x402/evm. Use an explicit price object with the asset address. Docs: https://docs.celo.org/build-on-celo/build-with-ai/x402

# buy (usebuy.ai)
- Marketplace where agents buy services over HTTP, paying with x402 on Celo: VMs, browsers, social and web data, Celo RPC via Chainstack, SQD indexing, inference. The gateway sponsors gas. It's in beta and payments are final.
- npm install -g @celo/buy · buy setup --name my-agent · buy mcp install --client all
- Paid call with a cap: buy curl --max-amount 0.005 <gateway url>
- Skill: https://github.com/celo-org/buy-skill

# Free USA₮
- Google Cloud Web3 faucet on Celo mainnet, with a one-time Self verification: https://cloud.google.com/application/web3/faucet/celo/mainnet

# Reference example
- Alcancía, a wARS/wBRL savings agent that applies to tracks 1, 2A and 3: https://alcancia-celo.vercel.app · repo: https://github.com/artugrande/alcancia · how it works: https://alcancia-celo.vercel.app/como-funciona · demo: https://alcancia-celo.vercel.app/demo.mp4

# Help
- Hackathon Telegram (write in English): https://t.me/realworldagentshackathon
- Office hours: Thursdays 12:00 GMT.
- Chainstack: 3 months of the Growth plan free per team (https://chainstack.com). Grants after the hackathon: https://www.prezenti.xyz
- Bridges to Celo: https://docs.celo.org/tooling/bridges/bridges

When you propose the project: tell me which track fits and why, the architecture, how it meets the mandatory rules (attribution tag, ERC-8004, mainnet) and the first steps to get something working today.`,
}

/* ---------- QR codes (pre-generated with the qrcode package, no runtime deps) ---------- */
const QR_LOOPS = { size: 37, d: "M2 2.5h7m1 0h1m1 0h1m1 0h1m9 0h1m3 0h7M2 3.5h1m5 0h1m1 0h1m1 0h3m4 0h1m1 0h1m1 0h2m1 0h1m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h2m1 0h2m2 0h1m1 0h4m1 0h1m3 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m2 0h1m2 0h1m10 0h2m1 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m2 0h2m1 0h2m1 0h2m1 0h1m2 0h2m1 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m5 0h2m4 0h1m1 0h2m1 0h1m2 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 9.5h1m1 0h2m5 0h2m1 0h3M2 10.5h1m2 0h6m2 0h2m2 0h1m1 0h1m1 0h2m3 0h2m2 0h1m1 0h3M2 11.5h2m1 0h1m1 0h1m3 0h2m1 0h1m1 0h2m2 0h2m2 0h2m4 0h3M4 12.5h1m2 0h4m1 0h3m1 0h2m1 0h2m2 0h1m1 0h3m2 0h3m1 0h1M3 13.5h5m1 0h1m3 0h2m1 0h2m1 0h1m1 0h2m4 0h1m1 0h1m2 0h1m1 0h1M2 14.5h2m1 0h1m2 0h1m1 0h1m1 0h1m2 0h2m1 0h3m1 0h3m3 0h2M3 15.5h2m1 0h1m2 0h2m1 0h1m5 0h1m2 0h1m1 0h3m5 0h1M4 16.5h1m2 0h2m1 0h2m1 0h4m1 0h1m7 0h1m1 0h2m1 0h2M3 17.5h3m1 0h1m2 0h1m2 0h3m1 0h1m3 0h1m5 0h1m1 0h1m1 0h2m1 0h1M2 18.5h3m2 0h3m1 0h1m4 0h1m3 0h3m1 0h1m1 0h6M2 19.5h2m2 0h2m1 0h1m1 0h1m3 0h1m1 0h1m2 0h4m2 0h3m1 0h1m1 0h1m1 0h1M3 20.5h1m1 0h1m2 0h1m3 0h2m3 0h1m3 0h2m2 0h1m1 0h3m1 0h2m1 0h1M2 21.5h3m1 0h1m7 0h1m3 0h6m1 0h1m1 0h1m2 0h3M7 22.5h3m1 0h1m3 0h3m4 0h2m2 0h1m2 0h1m1 0h1m2 0h1M2 23.5h1m2 0h2m2 0h1m4 0h2m2 0h3m1 0h1m1 0h2m3 0h3M2 24.5h1m4 0h3m3 0h2m2 0h2m4 0h1m1 0h1m1 0h2m4 0h2M2 25.5h1m4 0h1m1 0h1m2 0h4m2 0h2m4 0h7m1 0h1M2 26.5h4m2 0h1m2 0h1m1 0h6m2 0h2m3 0h5M10 27.5h6m1 0h2m1 0h1m3 0h3m3 0h1m1 0h2M2 28.5h7m1 0h4m1 0h1m1 0h1m2 0h2m1 0h4m1 0h1m1 0h1m1 0h1M2 29.5h1m5 0h1m1 0h1m1 0h1m1 0h4m3 0h1m3 0h2m3 0h5M2 30.5h1m1 0h3m1 0h1m1 0h2m1 0h2m1 0h2m1 0h5m1 0h6m2 0h1M2 31.5h1m1 0h3m1 0h1m1 0h1m1 0h2m5 0h1m2 0h1m4 0h1m1 0h1m1 0h2m1 0h1M2 32.5h1m1 0h3m1 0h1m2 0h2m1 0h1m1 0h1m1 0h3m1 0h1m1 0h1m1 0h1m2 0h6M2 33.5h1m5 0h1m3 0h2m1 0h4m5 0h1m2 0h8M2 34.5h7m1 0h2m2 0h1m3 0h2m4 0h3m2 0h2" }
const QR_TELEGRAM = { size: 33, d: "M2 2.5h7m3 0h4m2 0h1m1 0h3m1 0h7M2 3.5h1m5 0h1m3 0h2m1 0h4m1 0h1m3 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h1m1 0h2m4 0h1m3 0h1m1 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h1m1 0h3m4 0h1m4 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m2 0h3m2 0h1m1 0h3m1 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h2m2 0h4m1 0h1m4 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h1m2 0h1m1 0h1m1 0h1m4 0h1M2 10.5h1m1 0h5m2 0h1m1 0h1m2 0h1m2 0h1m1 0h1m2 0h5M4 11.5h2m1 0h1m1 0h1m1 0h4m3 0h1m1 0h5m1 0h1m3 0h1M2 12.5h3m2 0h2m1 0h2m2 0h1m2 0h1m6 0h3M2 13.5h6m1 0h2m1 0h3m1 0h3m2 0h1m2 0h4m1 0h1M3 14.5h1m3 0h4m1 0h1m4 0h3m2 0h1m4 0h2M2 15.5h1m3 0h1m2 0h1m2 0h2m1 0h2m1 0h5m1 0h3m3 0h1M2 16.5h2m2 0h1m1 0h2m1 0h1m1 0h7m2 0h2m1 0h4M3 17.5h3m5 0h1m1 0h3m1 0h1m2 0h6m3 0h1M4 18.5h1m3 0h1m3 0h3m1 0h2m1 0h1m1 0h1m5 0h2M2 19.5h2m2 0h1m4 0h3m4 0h1m2 0h6m1 0h1m1 0h1M2 20.5h1m2 0h1m2 0h3m1 0h3m2 0h2m3 0h1m5 0h1M2 21.5h1m1 0h3m2 0h4m3 0h1m3 0h3m2 0h1m3 0h1M2 22.5h1m1 0h1m1 0h4m9 0h1m2 0h5m1 0h3M10 23.5h2m1 0h1m1 0h2m1 0h1m2 0h2m3 0h5M2 24.5h7m4 0h1m1 0h8m1 0h1m1 0h3M2 25.5h1m5 0h1m1 0h1m3 0h2m5 0h2m3 0h1M2 26.5h1m1 0h3m1 0h1m1 0h2m2 0h1m1 0h2m1 0h1m2 0h5m1 0h1M2 27.5h1m1 0h3m1 0h1m1 0h6m2 0h3m6 0h4M2 28.5h1m1 0h3m1 0h1m1 0h4m1 0h4m1 0h5m1 0h4M2 29.5h1m5 0h1m2 0h2m4 0h1m2 0h1m1 0h2m2 0h2m1 0h1M2 30.5h7m1 0h1m1 0h3m1 0h2m1 0h1m1 0h1m3 0h4" }
const QR_CELOPEDIA = { size: 29, d: "M2 2.5h7m1 0h1m2 0h1m2 0h2m2 0h7M2 3.5h1m5 0h1m2 0h2m5 0h1m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m3 0h3m2 0h2m1 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h2m3 0h4m1 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h2m1 0h6m1 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h1m5 0h1m1 0h1m1 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h2m2 0h1m1 0h3M2 10.5h1m3 0h1m1 0h5m4 0h1m1 0h5m2 0h1M2 11.5h3m1 0h2m3 0h3m1 0h4m3 0h2m1 0h1M5 12.5h1m2 0h5m3 0h3m2 0h4M5 13.5h1m4 0h2m1 0h1m2 0h2m6 0h2M2 14.5h4m1 0h2m3 0h1m1 0h1m4 0h3m1 0h4M2 15.5h5m3 0h1m1 0h1m1 0h1m1 0h3m3 0h1m2 0h1M7 16.5h2m1 0h5m1 0h2m2 0h5M6 17.5h1m2 0h1m2 0h1m1 0h1m2 0h1m1 0h1m1 0h2m1 0h2M2 18.5h10m2 0h1m3 0h7M10 19.5h1m2 0h1m2 0h1m1 0h1m3 0h1M2 20.5h7m1 0h2m1 0h1m1 0h2m1 0h1m1 0h1m1 0h1M2 21.5h1m5 0h1m7 0h1m1 0h1m3 0h5M2 22.5h1m1 0h3m1 0h1m1 0h3m3 0h1m1 0h7M2 23.5h1m1 0h3m1 0h1m2 0h3m2 0h1m2 0h3m2 0h3M2 24.5h1m1 0h3m1 0h1m3 0h9m2 0h1m1 0h1M2 25.5h1m5 0h1m2 0h2m1 0h1m5 0h6M2 26.5h7m1 0h5m2 0h1m1 0h1m4 0h3" }
const QR_DECK = { size: 33, d: "M2 2.5h7m5 0h1m2 0h1m1 0h3m2 0h7M2 3.5h1m5 0h1m6 0h1m1 0h1m2 0h1m1 0h1m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m2 0h1m1 0h1m2 0h4m1 0h1m2 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m3 0h1m1 0h1m1 0h3m1 0h2m2 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m2 0h2m3 0h5m3 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h2m1 0h1m1 0h4m1 0h3m1 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M11 9.5h2m3 0h2m1 0h4M2 10.5h1m2 0h1m1 0h2m1 0h7m1 0h1m1 0h2m1 0h1m1 0h1M3 11.5h1m1 0h1m3 0h4m1 0h1m3 0h1m5 0h1m2 0h1m2 0h1M2 12.5h2m1 0h6m2 0h2m3 0h2m1 0h1m3 0h5M5 13.5h3m4 0h2m1 0h1m4 0h2m1 0h3m2 0h2M7 14.5h3m1 0h1m1 0h3m3 0h1m2 0h4m1 0h1m1 0h2M4 15.5h1m1 0h1m5 0h1m1 0h2m3 0h1m1 0h3M4 16.5h1m1 0h3m4 0h4m3 0h1m2 0h1m1 0h6M2 17.5h4m1 0h1m1 0h1m2 0h4m1 0h3m1 0h2m1 0h1m2 0h1m1 0h1M4 18.5h3m1 0h2m3 0h1m1 0h3m1 0h1m1 0h3m1 0h1m3 0h1M4 19.5h2m4 0h1m1 0h1m1 0h1m1 0h1m3 0h1m2 0h3m1 0h1m2 0h1M2 20.5h1m3 0h1m1 0h1m1 0h2m3 0h1m2 0h1m3 0h3m4 0h2M4 21.5h2m3 0h1m1 0h5m2 0h5m2 0h1m3 0h2M2 22.5h1m3 0h4m4 0h1m1 0h1m4 0h6m1 0h1M10 23.5h2m2 0h2m2 0h1m2 0h2m3 0h1m1 0h3M2 24.5h7m3 0h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1M2 25.5h1m5 0h1m1 0h1m1 0h2m1 0h1m1 0h2m1 0h1m1 0h1m3 0h4M2 26.5h1m1 0h3m1 0h1m2 0h4m1 0h1m1 0h2m2 0h5M2 27.5h1m1 0h3m1 0h1m1 0h2m1 0h2m1 0h1m4 0h1m2 0h1m1 0h4M2 28.5h1m1 0h3m1 0h1m3 0h1m3 0h1m1 0h2m3 0h1m2 0h3m1 0h1M2 29.5h1m5 0h1m3 0h8m1 0h3m5 0h1M2 30.5h7m1 0h2m1 0h1m2 0h1m2 0h1m2 0h1m1 0h1m1 0h2m1 0h1" }

/* ---------- small pieces ---------- */
function Cmd({ children }: { children: string }) {
  const lang = useContext(LangCtx)
  const [ok, setOk] = useState(false)
  return (
    <div className="bs-cmd">
      <pre>{children}</pre>
      <button
        onClick={() =>
          navigator.clipboard?.writeText(children).then(() => {
            setOk(true)
            setTimeout(() => setOk(false), 1200)
          })
        }
      >
        {ok ? (lang === "es" ? "copiado" : "copied") : lang === "es" ? "copiar" : "copy"}
      </button>
    </div>
  )
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="bs-link">
      {children}
    </a>
  )
}

function Label({ k, v }: { k: string; v?: React.ReactNode }) {
  return (
    <div className="bs-label">
      <span>{k}:</span> {v}
    </div>
  )
}

function QR({ q, label, url }: { q: { size: number; d: string }; label: string; url: string }) {
  return (
    <a className="bs-qr" href={`https://${url}`} target="_blank" rel="noopener noreferrer">
      <div className="bs-qr-card">
        <svg viewBox={`0 0 ${q.size} ${q.size}`} xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
          <path fill="#ffffff" d={`M0 0h${q.size}v${q.size}H0z`} />
          <path stroke={BG} d={q.d} />
        </svg>
      </div>
      <b>{label}</b>
      <span>{url}</span>
    </a>
  )
}

function Logos() {
  return (
    <div className="bs-logos">
      <img src="/builder-session/celo.png" alt="Celo" className="bs-logo-celo" />
      <i />
      <img src="/builder-session/ripio.svg" alt="Ripio" className="bs-logo-ripio" />
    </div>
  )
}

function Track({
  color,
  label,
  titulo,
  bajada,
  arranque,
  criterios,
  premios,
  arte,
  links,
}: {
  color: string
  label: string
  titulo: string
  bajada: React.ReactNode
  arranque: string
  criterios: string[]
  premios: [string, string][]
  arte: string
  links: [string, string][]
}) {
  const lang = useContext(LangCtx)
  return (
    <div className="bs-split bs-trk" style={{ ["--c" as string]: color }}>
      <div>
        <Label k={label.split(" · ")[0]} v={<span style={{ color }}>{label.split(" · ").slice(1).join(" · ")}</span>} />
        <h2 className="bs-h2">{titulo}</h2>
        <p className="bs-p">{bajada}</p>
        <div className="bs-mini">{lang === "es" ? "Para arrancar" : "Get started"}</div>
        <Cmd>{arranque}</Cmd>
        <div className="bs-trk-links">
          {links.map(([t, u]) => (
            <A key={u} href={u}>
              {t} ↗
            </A>
          ))}
        </div>
      </div>
      <div className="bs-trk-r">
        <img src={arte} alt="" />
        <div className="bs-trk-prizes">
          {premios.map(([k, v]) => (
            <div key={k}>
              <em>{k}</em>
              <b>{v}</b>
            </div>
          ))}
        </div>
        <div className="bs-crit">
          <div className="bs-crit-t">{lang === "es" ? "Cómo se evalúa" : "How it's judged"}</div>
          <ul className="bs-ul">
            {criterios.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ---------- slides ---------- */
function slides(lang: Lang): { node: React.ReactNode }[] {
  const t = <T,>(es: T, en: T): T => (lang === "es" ? es : en)
  const PRIMERO = t("1ER PUESTO", "1ST PLACE")
  const SEGUNDO = t("2DO PUESTO", "2ND PLACE")
  return [
    // 1 · cover
    {
      node: (
        <div className="bs-cover">
          <div className="bs-cover-l">
            <div className="bs-serif bs-event">Agents on Open Rails Hackathon</div>
            <h1 className="bs-h1">
              Stable Agents:
              <br />
              LatAm IRL
            </h1>
            <div className="bs-tag">
              / Builder Session
              <br />
              &nbsp; Celo Core Co. × Ripio
            </div>
            <div className="bs-cover-meta">
              <Label k={t("FECHA", "DATE")} v={t("sáb 17/10 · 18:00 a 20:00", "Sat Oct 17 · 6 to 8 PM (ART)")} />
              <Label k={t("SEDES", "CITIES")} v={t("6 ciudades de Argentina", "6 cities across Argentina")} />
            </div>
            <Logos />
          </div>
          <img
            src="/builder-session/mapa.webp"
            alt={t("Mapa de Argentina con las 6 sedes", "Map of Argentina with the 6 cities")}
            className="bs-cover-map"
          />
        </div>
      ),
    },
    // 2 · agenda
    {
      node: (
        <>
          <Label
            k="AGENDA"
            v={t("18:00 a 20:00 · en una cafetería, sin apuro", "6 to 8 PM · at a café, no rush")}
          />
          <h2 className="bs-h2">
            {t("Pedite un café. Esto es más charla que clase.", "Grab a coffee. This is more chat than class.")}
          </h2>
          <div className="bs-agbar" aria-hidden>
            {AGENDA.map((b) => (
              <i key={b.h} style={{ flexGrow: b.min }} />
            ))}
          </div>
          <div className="bs-agenda">
            {AGENDA.map((b) => (
              <div key={b.h} className="bs-ag">
                <b>{b.h}</b>
                <em>{b.min} min</em>
                <strong>{b[lang][0]}</strong>
                {Array.isArray(b[lang][1]) ? (
                  <ul className="bs-ul bs-ag-ul">
                    {(b[lang][1] as string[]).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <span>{b[lang][1]}</span>
                )}
              </div>
            ))}
          </div>
        </>
      ),
    },
    // 3 · builder sessions
    {
      node: (
        <div className="bs-split">
          <div>
            <Label
              k="IRL"
              v={t(
                "sábado 17 de octubre · 18:00 a 20:00 en todas las sedes",
                "Saturday, October 17 · 6 to 8 PM in every city",
              )}
            />
            <h2 className="bs-h2">
              {t("6 builder sessions, el mismo día, en todo el país.", "6 builder sessions, same day, across the country.")}
            </h2>
            <div className="bs-sedes">
              {SEDES.map((s) => (
                <a key={s.ciudad} href={s.luma} target="_blank" rel="noopener noreferrer" className="bs-sede">
                  <b>{s.ciudad}</b>
                  <span className="bs-sede-host">@{s.host}</span>
                  <span className="bs-sede-lugar">
                    {s.lugar} · {s.dir}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <img src="/builder-session/mapa.webp" alt="" className="bs-split-map" />
        </div>
      ),
    },
    // 4 · celo (wording and metrics from celo.org)
    {
      node: (
        <>
          <Label k="CHAIN" v={<span className="bs-white">▣ CELO</span>} />
          <h2 className="bs-h2">
            {t("Los rieles programables líderes para las finanzas globales.", "The leading programmable rails for global finance.")}
          </h2>
          <p className="bs-p">
            {t(
              "La blockchain más adoptada para pagos con stablecoins.",
              "The most widely adopted blockchain for stablecoin payments.",
            )}
          </p>
          <div className="bs-stats bs-stats-3">
            {[
              ["$6.2B", t("Volumen mensual en stablecoins", "Monthly stablecoin volume")],
              ["700K", t("Usuarios activos por día", "Daily active users")],
              ["1.1B", t("Transacciones totales", "Total transactions")],
            ].map(([n, l]) => (
              <div key={n}>
                <b>{n}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <div className="bs-infra">
            {t(
              ["L2 de Ethereum", "Bloques de ~1 segundo", "Gas promedio de $0.0005", "Gas en stablecoins, por ejemplo USD₮ y USDC"],
              ["Ethereum L2", "~1-second blocks", "$0.0005 average gas", "Gas in stablecoins, for example USD₮ and USDC"],
            ).map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </>
      ),
    },
    // 5 · the hackathon
    {
      node: (
        <div className="bs-split">
          <div>
            <Label k="LOADING" v={<span className="bs-white">AGENTS ON OPEN RAILS HACKATHON</span>} />
            <h2 className="bs-h2">
              {t(
                "Agentes que cobran, pagan y liquidan en rieles reales, con plata real.",
                "Agents that earn, pay and settle on live rails, with real money moving.",
              )}
            </h2>
            <div className="bs-kv">
              <Label
                k={t("VENTANA", "WINDOW")}
                v={
                  <span className="bs-white">
                    {t("6/10 → lunes 9/11, 06:00 (hora argentina)", "Oct 6 → Mon Nov 9, 09:00 GMT")}
                  </span>
                }
              />
              <Label k={t("GANADORES", "WINNERS")} v={<span className="bs-white">{t("viernes 13/11", "Fri Nov 13")}</span>} />
              <Label k={t("PREMIOS", "PRIZES")} v={<span className="bs-yellow">{t("US$5.000 en $CELO", "US$5,000 in $CELO")}</span>} />
              <Label k="CHAIN" v={<span className="bs-white">▣ Celo mainnet</span>} />
              <Label k={t("DÓNDE", "WHERE")} v={<span className="bs-white">{t("online, en Loops House", "online, on Loops House")}</span>} />
            </div>
            <p className="bs-foot">
              {t(
                "Podés usar cualquier framework de agentes y anotarte en más de un track.",
                "Any agent framework is allowed and you can enter more than one track.",
              )}
            </p>
          </div>
          <img src="/builder-session/hackathon.webp" alt="" className="bs-split-art" />
        </div>
      ),
    },
    // 6 · tracks
    {
      node: (
        <>
          <Label k="TRACKS" v={t("4 formas de ganar", "4 ways to win")} />
          <div className="bs-tracks">
            <div className="bs-track" style={{ ["--c" as string]: GREEN }}>
              <img src="/builder-session/track-latam.webp" alt="" />
              <em>TRACK 1 · RIPIO × CELO</em>
              <b>Stable Agents: LatAm</b>
              <p>
                {t(
                  "Agentes que cobran, pagan, ahorran y liquidan en las stablecoins locales de Ripio.",
                  "Agents that charge, pay, save and settle in Ripio's local currency stablecoins.",
                )}
              </p>
              <strong>{t("$1.500 · $500", "$1,500 · $500")}</strong>
            </div>
            <div className="bs-track" style={{ ["--c" as string]: PURPLE }}>
              <img src="/builder-session/track-corridors.webp" alt="" />
              <em>TRACK 2A · TEXTILE</em>
              <b>Open Corridors: FX</b>
              <p>
                {t(
                  "Agentes que cotizan y liquidan FX en Textile, un mercado de cambio onchain.",
                  "Agents that quote and settle FX on Textile, an onchain FX marketplace.",
                )}
              </p>
              <strong>$750 · $250</strong>
            </div>
            <div className="bs-track" style={{ ["--c" as string]: PURPLE }}>
              <img src="/builder-session/track-corridors.webp" alt="" />
              <em>TRACK 2B · CELO x402</em>
              <b>{t("Open Corridors: USA₮ con x402", "Open Corridors: USA₮ with x402")}</b>
              <p>
                {t(
                  "Productos con usuarios reales que liquidan USA₮ con el facilitador x402 de Celo.",
                  "Products with real users settling USA₮ through Celo's x402 facilitator.",
                )}
              </p>
              <strong>$750 · $250</strong>
            </div>
            <div className="bs-track" style={{ ["--c" as string]: ORANGE }}>
              <img src="/builder-session/track-buy.webp" alt="" />
              <em>TRACK 3 · USEBUY.AI</em>
              <b>Build with buy</b>
              <p>
                {t(
                  "Productos que pagan por servicios que no son suyos: cómputo, browsers, datos, inferencia.",
                  "Products that pay for services they don't own: compute, browsers, data, inference.",
                )}
              </p>
              <strong>{t("$1.000 entre 5", "$1,000 across 5")}</strong>
            </div>
          </div>
        </>
      ),
    },
    // 7 · track 1 in depth
    {
      node: (
        <div className="bs-split">
          <div>
            <Label k="TRACK 1" v={<span style={{ color: GREEN }}>STABLE AGENTS: LATAM · RIPIO × CELO CORE CO.</span>} />
            <h2 className="bs-h2">
              {t(
                "En LatAm, mover plata casi siempre implica pasar por el dólar.",
                "Across LatAm, moving money usually means converting through the dollar first.",
              )}
            </h2>
            <p className="bs-p">
              {t(
                "Y cada conversión cobra su comisión. Construí agentes que cobren, paguen, ahorren y liquiden directo en ",
                "And every step charges a fee. Build agents that charge, pay, save and settle directly in ",
              )}
              <b>{t("wARS, wBRL, wMXN, wCOP, wPEN y wCLP", "wARS, wBRL, wMXN, wCOP, wPEN and wCLP")}</b>.
            </p>
            <div className="bs-crit">
              <div className="bs-crit-t">{t("Cómo se evalúa", "How it's judged")}</div>
              <ul className="bs-ul">
                {t(
                  [
                    "Funciona en mainnet con un token wFiat real",
                    "Usa en serio wFiat y el stack de Celo",
                    "El agente es autónomo y útil",
                    "Una persona real puede usar la experiencia",
                    "El impacto en LatAm es claro",
                  ],
                  [
                    "Works on mainnet with a real wFiat token",
                    "Real use of wFiat and the Celo stack",
                    "The agent is autonomous and useful",
                    "A real person can use the UX",
                    "Clear LatAm impact",
                  ],
                ).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bs-prize">
            <div>
              <em>{PRIMERO}</em>
              <b>{t("$1.500", "$1,500")}</b>
            </div>
            <div>
              <em>{SEGUNDO}</em>
              <b>$500</b>
            </div>
          </div>
        </div>
      ),
    },
    // 8 · wFiat tokens
    {
      node: (
        <>
          <Label k={t("RECURSOS", "RESOURCES")} v={t("stablecoins wFiat de Ripio", "Ripio's wFiat stablecoins")} />
          <h2 className="bs-h2">{t("Seis monedas locales, onchain.", "Six local currencies, onchain.")}</h2>
          <div className="bs-tokens">
            {TOKENS.map((tk) => (
              <div key={tk.s} className="bs-token">
                <img src={`/builder-session/tokens/${tk.logo}.svg`} alt="" />
                <div>
                  <b>{tk.s}</b>
                  <span>{tk[lang]}</span>
                </div>
                <code>{tk.addr}</code>
              </div>
            ))}
          </div>
          <p className="bs-foot">
            {t(
              "Misma dirección en Celo y en las demás cadenas EVM. Todos usan 18 decimales. Precios en CoinGecko.",
              "Same address on Celo and every other EVM chain. All use 18 decimals. Prices on CoinGecko.",
            )}
          </p>
        </>
      ),
    },
    // 9 · ramps + bridge
    {
      node: (
        <>
          <Label k={t("RECURSOS", "RESOURCES")} v={t("on/off-ramps y bridge de Ripio", "Ripio on/off-ramps and bridge")} />
          <h2 className="bs-h2">
            {t("Entrar y salir de moneda local, sin credenciales.", "In and out of local currency, no credentials.")}
          </h2>
          <div className="bs-qrs bs-qrs-3">
            <QR q={QR_RAMP} label={t("On/off-ramp sin credenciales", "On/off-ramp, no credentials")} url="ramp.ripio.com" />
            <QR q={QR_RIPIODOCS} label={t("Ramps API · solo empresas", "Ramps API · companies only")} url="docs.ripio.com" />
            <QR q={QR_BRIDGE} label="Bridge" url="bridge.ripio.com" />
          </div>
          <div className="bs-mini">
            {t(
              "Ejemplo en Celo mainnet (chain 42220): on-ramp de 10.000 wARS",
              "Example on Celo mainnet (chain 42220): on-ramp 10,000 wARS",
            )}
          </div>
          <Cmd>{"https://ramp.ripio.com/?country=AR&chain=42220&token=WARS&amount=10000&address=0x..."}</Cmd>
        </>
      ),
    },
    // track 2A · textile
    {
      node: (
        <Track
          color={PURPLE}
          label="TRACK 2A · OPEN CORRIDORS · TEXTILE FX"
          titulo={t(
            "Agentes que hacen el cambio de moneda barato, rápido y verificable.",
            "Agents that make crossing between currencies affordable, fast and verifiable.",
          )}
          bajada={t(
            <>
              Textile FX es un mercado de cambio <b>onchain y permissionless</b> en Celo: cotizás y liquidás{" "}
              <b>cNGN, wARS, wBRL y USDC contra USD₮</b>. Tu agente puede hacer market making, rutear pagos cross-border
              al mejor precio o correr una estrategia propia.
            </>,
            <>
              Textile FX is a <b>permissionless onchain FX marketplace</b> on Celo: quote and settle{" "}
              <b>cNGN, wARS, wBRL and USDC against USD₮</b>. Your agent can make markets, route cross-border payments to
              the best price or run its own strategy.
            </>,
          )}
          arranque="https://app.textilecredit.com"
          criterios={t(
            ["P&L de la estrategia", "Volumen cotizado y ejecutado", "Originalidad"],
            ["Strategy P&L", "Volume quoted and filled", "Originality"],
          )}
          premios={[
            [PRIMERO, "$750"],
            [SEGUNDO, "$250"],
          ]}
          arte="/builder-session/track-corridors.webp"
          links={[["Textile FX", "https://app.textilecredit.com"]]}
        />
      ),
    },
    // track 2B · x402
    {
      node: (
        <Track
          color={PURPLE}
          label={t("TRACK 2B · OPEN CORRIDORS · USA₮ CON x402", "TRACK 2B · OPEN CORRIDORS · USA₮ WITH x402")}
          titulo={t("Cobrar por request, sin cuentas ni API keys.", "Charge per request, no accounts or API keys.")}
          bajada={t(
            <>
              x402 usa el HTTP 402: tu servidor pide el pago, el agente firma y reintenta. El <b>facilitador de Celo</b>{" "}
              liquida onchain y paga el gas (EIP-3009). Acepta <b>USA₮, USDC y USD₮</b>, y también <b>wARS, wBRL y wCOP</b>.
              Pide usuarios reales e independientes.
            </>,
            <>
              x402 uses HTTP 402: your server asks for payment, the agent signs and retries. <b>Celo&apos;s facilitator</b>{" "}
              settles onchain and pays the gas (EIP-3009). It accepts <b>USA₮, USDC and USD₮</b>, plus{" "}
              <b>wARS, wBRL and wCOP</b>. Real, independent users required.
            </>,
          )}
          arranque={"npm i @x402/express @x402/core @x402/evm\ncurl -s https://api.x402.celo.org/supported"}
          criterios={t(
            [
              "Liquidación real entre partes independientes: wallets que no son tuyas, no fondeadas por vos y con actividad en Celo previa a la hackathon",
              "La moneda elegida se justifica por el usuario al que servís",
            ],
            [
              "Real settlement between independent parties: wallets that aren't yours, weren't funded by you and had Celo activity before the hackathon",
              "The currency choice is justified by the user it serves",
            ],
          )}
          premios={[
            [PRIMERO, "$750"],
            [SEGUNDO, "$250"],
          ]}
          arte="/builder-session/track-x402.webp"
          links={[
            ["x402.celo.org", "https://x402.celo.org"],
            ["Docs", "https://docs.celo.org/build-on-celo/build-with-ai/x402"],
          ]}
        />
      ),
    },
    // track 3 · buy
    {
      node: (
        <Track
          color={ORANGE}
          label="TRACK 3 · BUILD WITH BUY · USEBUY.AI"
          titulo={t(
            "Un producto que paga por servicios que no son suyos.",
            "A product that pays for services it doesn't own.",
          )}
          bajada={t(
            <>
              buy es un marketplace donde los agentes compran servicios por HTTP, pagando por request desde una wallet con
              x402 en Celo: <b>VMs, browsers, datos de redes y web, RPC de Celo, indexación con SQD e inferencia</b>. El
              gateway paga el gas: no necesitás tener CELO. Se usa desde Claude Code, Codex o la terminal. Está en beta y
              los pagos son finales.
            </>,
            <>
              buy is a marketplace where agents buy services over HTTP, paying per request from one wallet with x402 on
              Celo: <b>VMs, browsers, social and web data, Celo RPC, SQD indexing and inference</b>. The gateway sponsors
              gas, so you don&apos;t need CELO. Use it from Claude Code, Codex or the command line. It&apos;s in beta and
              payments are final.
            </>,
          )}
          arranque={t(
            "npm install -g @celo/buy\nbuy setup --name mi-agente\nbuy mcp install --client all",
            "npm install -g @celo/buy\nbuy setup --name my-agent\nbuy mcp install --client all",
          )}
          criterios={t(
            [
              "El problema real que resolvés",
              "Profundidad de la integración: llamadas pagas verificadas a servicios que no controlás",
              "El crecimiento que les generás a esos servicios. Spamear la llamada más barata no suma.",
            ],
            [
              "The real problem you solve",
              "Integration depth: verified paid calls into services you don't control",
              "The growth you create for those services. Spamming the cheapest call scores nothing.",
            ],
          )}
          premios={[[t("REPARTIDOS ENTRE 5 PROYECTOS", "ACROSS 5 PROJECTS"), t("$1.000", "$1,000")]]}
          arte="/builder-session/track-buy.webp"
          links={[
            ["usebuy.ai", "https://usebuy.ai"],
            ["buy-skill", "https://github.com/celo-org/buy-skill"],
          ]}
        />
      ),
    },
    // USA₮ faucet
    {
      node: (
        <div className="bs-split">
          <div>
            <Label k={t("USA₮ GRATIS", "FREE USA₮")} v={<span className="bs-white">GOOGLE CLOUD WEB3 FAUCET</span>} />
            <h2 className="bs-h2">{t("Conseguí tus primeros 5 USA₮ y arrancá.", "Get your first 5 USA₮ and start building.")}</h2>
            <ol className="bs-ol">
              <li>{t("Escaneá el QR y abrí el faucet de Celo mainnet.", "Scan the QR and open the Celo mainnet faucet.")}</li>
              <li>
                {t(
                  "Verificate una sola vez con Self (prueba de identidad con tu documento).",
                  "Verify once with Self (a one-time ID proof).",
                )}
              </li>
              <li>
                {t(
                  "Recibí USA₮ en tu wallet y usalo para tus primeras llamadas con x402 o buy.",
                  "Receive USA₮ in your wallet and use it for your first x402 or buy calls.",
                )}
              </li>
            </ol>
          </div>
          <QR q={QR_FAUCET} label={t("Faucet de USA₮", "USA₮ faucet")} url="cloud.google.com/application/web3/faucet/celo/mainnet" />
        </div>
      ),
    },
    // ideas
    {
      node: (
        <>
          <Label k="IDEAS" v={t("para arrancar, no son obligatorias", "to get you started, not required")} />
          <h2 className="bs-h2">{t("¿Qué agente podrías construir?", "What agent could you build?")}</h2>
          <div className="bs-ideas">
            {t(
              [
                ["Cobrador", "Emite cobros en wARS, avisa al cliente por WhatsApp y concilia cuando entra el pago."],
                ["Remesas sin dólar", "Manda wARS a Brasil y llega como wBRL, sin pasar por USD en el medio."],
                ["Ahorro automático", "Separa un porcentaje de cada cobro y lo aparta apenas entra."],
                ["Pago a proveedores", "Paga facturas recurrentes en la moneda de cada país, con límites que vos definís."],
                ["Gastos compartidos", "Divide los gastos de un viaje y liquida a cada uno en su moneda."],
                ["Comercio en el chat", "Un bot de Telegram que vende y cobra en moneda local, de punta a punta."],
              ],
              [
                ["Collector", "Issues invoices in wARS, pings the customer on WhatsApp and reconciles when the payment lands."],
                ["Remittances, no dollar", "Sends wARS to Brazil and it arrives as wBRL, without going through USD."],
                ["Auto-savings", "Sets aside a percentage of every payment the moment it comes in."],
                ["Supplier payments", "Pays recurring invoices in each country's currency, within limits you define."],
                ["Shared expenses", "Splits a trip's costs and settles each person in their own currency."],
                ["Chat commerce", "A Telegram bot that sells and gets paid in local currency, end to end."],
              ],
            ).map(([ti, d]) => (
              <div key={ti} className="bs-idea">
                <b>{ti}</b>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    // celopedia
    {
      node: (
        <div className="bs-split">
          <div>
            <Label k="STACK · 01" v={<span className="bs-white">CELOPEDIA</span>} />
            <h2 className="bs-h2">
              {t("Tu coding agent ya sabe construir en Celo.", "Your coding agent already knows how to build on Celo.")}
            </h2>
            <p className="bs-p">
              {t(
                <>
                  La skill oficial de Celo: <b>150+ contratos verificados</b>, protocolos DeFi, stablecoins, MiniPay,
                  grants e infraestructura para agentes. Documentada para <b>Claude Code, Codex y OpenClaw</b>.
                </>,
                <>
                  Celo&apos;s official skill: <b>150+ verified contracts</b>, DeFi protocols, stablecoins, MiniPay, grants
                  and agent infrastructure. Documented for <b>Claude Code, Codex and OpenClaw</b>.
                </>,
              )}
            </p>
            <Cmd>
              {t(
                "npx skills add celo-org/celopedia-skills\n# en Claude Code, además:\nmkdir -p .claude && ln -s ../.agents/skills .claude/skills",
                "npx skills add celo-org/celopedia-skills\n# for Claude Code, also:\nmkdir -p .claude && ln -s ../.agents/skills .claude/skills",
              )}
            </Cmd>
            <div className="bs-mini">{t("Después pedile, en tu idioma:", "Then just ask, in plain language:")}</div>
            <ul className="bs-ul">
              {t(
                [
                  '"Armame un agente de IA que haga micropagos con x402."',
                  '"Quiero construir una Mini App de pagos, mostrame cómo."',
                  '"Armame un proyecto con fee abstraction para pagar el gas en USD₮."',
                ],
                [
                  '"Build an AI agent that makes micropayments with x402."',
                  '"I want to build a payments Mini App, show me how."',
                  '"Set up a project with fee abstraction to pay gas in USD₮."',
                ],
              ).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <QR q={QR_CELOPEDIA} label="Celopedia" url="celopedia.celo.org" />
        </div>
      ),
    },
    // eve
    {
      node: (
        <div className="bs-split">
          <div>
            <Label k="STACK · 02" v={<span className="bs-white">EVE · VERCEL</span>} />
            <div className="bs-vercel">
              <img src="/builder-session/vercel.svg" alt="Vercel" className="bs-vercel-word" />
              <i />
              <img src="/builder-session/eve.svg" alt="eve" className="bs-vercel-eve" />
            </div>
            <h2 className="bs-h2">{t("Como Next.js, pero para agentes.", "Like Next.js, but for agents.")}</h2>
            <p className="bs-p">
              {t(
                "eve es el framework de agentes open source (Apache-2.0) de Vercel, en beta. Un agente es una carpeta: instrucciones y skills en Markdown, tools en TypeScript. eve arma workflows durables, lo conecta a Slack, Discord o la web y se deploya en Vercel en menos de un minuto.",
                "eve is Vercel's open-source (Apache-2.0) agent framework, in beta. An agent is a directory: instructions and skills in Markdown, tools in TypeScript. eve wires up durable workflows, connects it to Slack, Discord or the web and deploys on Vercel in under a minute.",
              )}
            </p>
            <Cmd>
              {t(
                "npx eve@latest init mi-agente\ncd mi-agente && npm run dev",
                "npx eve@latest init my-agent\ncd my-agent && npm run dev",
              )}
            </Cmd>
            <p className="bs-foot">
              {t(
                "Necesitás Node 24 o más. Para darle contexto a tu coding agent: ",
                "Requires Node 24 or newer. To give your coding agent context: ",
              )}
              <A href="https://eve.dev/llms.txt">eve.dev/llms.txt</A>
            </p>
          </div>
          <pre className="bs-tree">
            {t(
              `agent/
  instructions.md      ← el agente
  agent.ts             modelo y runtime
  skills/              playbooks .md
  tools/cobrar.ts      tools en TS
  channels/telegram.ts canales
  schedules/diario.md  tareas con cron`,
              `agent/
  instructions.md      ← the agent
  agent.ts             model, runtime
  skills/              .md playbooks
  tools/charge.ts      TS tools
  channels/telegram.ts channels
  schedules/daily.md   cron jobs`,
            )}
          </pre>
        </div>
      ),
    },
    // zero to agent
    {
      node: (
        <>
          <Label k="DEMO" v={t("de cero a un agente", "from zero to an agent")} />
          <h2 className="bs-h2">
            {t("Cuatro pasos y tu coding agent hace el resto.", "Four steps and your coding agent does the rest.")}
          </h2>
          <div className="bs-steps">
            {t(
              [
                ["01", "Instalá Celopedia", "npx skills add celo-org/celopedia-skills"],
                ["02", "Creá el agente con eve", "npx eve@latest init mi-agente"],
                ["03", "Pegale este prompt", "con tu idea"],
                ["04", "Deployá en Vercel", "y probalo en mainnet"],
              ],
              [
                ["01", "Install Celopedia", "npx skills add celo-org/celopedia-skills"],
                ["02", "Create the agent with eve", "npx eve@latest init my-agent"],
                ["03", "Paste this prompt", "with your idea"],
                ["04", "Deploy on Vercel", "and test it on mainnet"],
              ],
            ).map(([n, ti, d]) => (
              <div key={n} className="bs-step">
                <span>{n}</span>
                <b>{ti}</b>
                <code>{d}</code>
              </div>
            ))}
          </div>
          <Cmd>{PROMPT_AGENTE[lang]}</Cmd>
        </>
      ),
    },
    // live demo by the host
    {
      node: (
        <>
          <Label k={t("DEMO EN VIVO", "LIVE DEMO")} v={t("lo construyó tu host", "built by your host")} />
          <h2 className="bs-h2">{t("Un agente real, una transacción real.", "A real agent, a real transaction.")}</h2>
          <div className="bs-steps bs-demo">
            {t(
              [
                ["01", "La idea", "Qué problema resuelve y para quién."],
                ["02", "El código", "eve + Celopedia: instrucciones, tools y el prompt que usó."],
                ["03", "La transacción", "Un pago en Celo mainnet con attribution tag, abierto en Celoscan."],
                ["04", "La identidad", "El agente registrado con ERC-8004, visible en 8004scan."],
              ],
              [
                ["01", "The idea", "What problem it solves and for whom."],
                ["02", "The code", "eve + Celopedia: instructions, tools and the prompt behind it."],
                ["03", "The transaction", "A payment on Celo mainnet with an attribution tag, opened on Celoscan."],
                ["04", "The identity", "The agent registered with ERC-8004, visible on 8004scan."],
              ],
            ).map(([n, ti, d]) => (
              <div key={n} className="bs-step">
                <span>{n}</span>
                <b>{ti}</b>
                <em>{d}</em>
              </div>
            ))}
          </div>
          <div className="bs-trk-links">
            <A href="https://celoscan.io">celoscan.io ↗</A>
            <A href="https://8004scan.io">8004scan.io ↗</A>
          </div>
        </>
      ),
    },
    // Alcancía 1 · demo video
    {
      node: (
        <>
          <Label
            k={t("EJEMPLO", "EXAMPLE")}
            v={<span style={{ color: GREEN }}>{t("ALCANCÍA · AGENTE DE AHORRO EN wARS / wBRL", "ALCANCÍA · wARS / wBRL SAVINGS AGENT")}</span>}
          />
          <h2 className="bs-h2">{t("Mirá un agente real funcionando.", "Watch a real agent in action.")}</h2>
          <div className="bs-video">
            <video
              src="https://alcancia-celo.vercel.app/demo.mp4"
              poster="/builder-session/alcancia-video-poster.webp"
              controls
              playsInline
              preload="none"
            />
            <img src="/builder-session/alcancia-video-poster.webp" alt="" className="bs-video-still" />
          </div>
        </>
      ),
    },
    // Alcancía 2 · how it works, in frames from the demo
    {
      node: (
        <>
          <Label k={t("EJEMPLO", "EXAMPLE")} v={t("cómo funciona Alcancía", "how Alcancía works")} />
          <h2 className="bs-h2">
            {t("Charlás, firma, ahorra solo.", "You chat, it signs, it saves on its own.")}
          </h2>
          <div className="bs-frames">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <img key={n} src={`/builder-session/alcancia-paso-${n}.webp`} alt="" />
            ))}
          </div>
        </>
      ),
    },
    // Alcancía 3 · every link as a QR
    {
      node: (
        <>
          <Label k={t("EJEMPLO", "EXAMPLE")} v={t("todo Alcancía, a un escaneo", "all of Alcancía, one scan away")} />
          <h2 className="bs-h2">{t("Probalo y mirá cómo está hecho.", "Try it and see how it's built.")}</h2>
          <div className="bs-qrgrid">
            <QR q={QR_AL_WEB} label={t("Probar la app", "Try the app")} url="alcancia-celo.vercel.app" />
            <QR q={QR_AL_REPO} label={t("Repo", "Repo")} url="github.com/artugrande/alcancia" />
            <QR q={QR_AL_SPEC} label={t("Spec", "Spec")} url="arturogrande.com/builder-session/alcancia-spec.pdf" />
            <QR q={QR_AL_HOW} label={t("Cómo funciona", "How it works")} url="alcancia-celo.vercel.app/como-funciona" />
            <QR q={QR_LOOPS} label={t("Submission", "Submission")} url="loops.house/agents-on-open-rails" />
          </div>
        </>
      ),
    },
    // Alcancía 4 · the Loops House submission
    {
      node: (
        <>
          <Label k="SUBMISSION" v={<span className="bs-white">LOOPS HOUSE</span>} />
          <h2 className="bs-h2">
            {t("Así tiene que quedar tu proyecto en Loops House.", "This is how your project should look on Loops House.")}
          </h2>
          <img
            src="/builder-session/alcancia-loops.webp"
            alt={t("Alcancía cargada en Loops House", "Alcancía on Loops House")}
            className="bs-loops-shot"
          />
        </>
      ),
    },
    // rules
    {
      node: (
        <>
          <Label k={t("REGLAS", "RULES")} v={t("lo que no te podés saltear", "the non-negotiables")} />
          <h2 className="bs-h2">{t("Sin esto, tu proyecto no suma.", "Without these, your project doesn't count.")}</h2>
          <div className="bs-rules">
            {t(
              [
                ["Celo mainnet", ["Solo cuenta mainnet (chain 42220)", "Testnet en el repo está bien"]],
                ["Repo público", ["En GitHub desde la inscripción", "Accesible hasta el juzgamiento", "Código escrito durante la hackathon"]],
                ["Tracks", ["Podés entrar en varios", "Máximo un premio por track por equipo"]],
                ["Gas", ["Si tu relayer paga el gas, no cuenta como aporte del builder", "Contalo en la entrega"]],
              ],
              [
                ["Celo mainnet", ["Only mainnet counts (chain 42220)", "Testnet in the repo is fine"]],
                ["Public repo", ["On GitHub from registration", "Still live at judging", "Code written during the hackathon"]],
                ["Tracks", ["Enter as many as you like", "One prize per track per team"]],
                ["Gas", ["Gas paid by your own relayer doesn't count as builder contribution", "Say so in your submission"]],
              ],
            ).map(([ti, xs]) => (
              <div key={ti as string}>
                <b>{ti}</b>
                <ul className="bs-ul">
                  {(xs as string[]).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ),
    },
    // attribution tag + ERC-8004
    {
      node: (
        <>
          <Label k={t("OBLIGATORIO", "REQUIRED")} v={t("en todos los tracks", "in every track")} />
          <h2 className="bs-h2">{t("Tu agente tiene que firmar y tener nombre.", "Your agent has to sign its work and have a name.")}</h2>
          <div className="bs-id">
            <div>
              <div className="bs-id-t">
                <b>Attribution tag</b>
                <em>ERC-8021</em>
              </div>
              <ul className="bs-ul">
                {t(
                  [
                    "Te lo dan al inscribirte en Loops House",
                    "Va en el calldata de cada transacción",
                    "Se agrega en el cliente de la wallet, no en el contrato",
                    "Sin tag, la transacción no se acredita",
                  ],
                  [
                    "Issued when you enroll on Loops House",
                    "Goes in the calldata of every transaction",
                    "Added in your wallet client, not in the contract",
                    "No tag, no credit for that transaction",
                  ],
                ).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <QR q={QR_ATTR} label="SDK" url="github.com/celo-org/attribution-tags" />
            </div>
            <div>
              <div className="bs-id-t">
                <b>{t("Identidad del agente", "Agent identity")}</b>
                <em>ERC-8004</em>
              </div>
              <ul className="bs-ul">
                {t(
                  [
                    "Obligatoria en todos los tracks",
                    "Se registra desde la wallet del agente",
                    "Antes del cierre: lunes 9/11",
                    "Se ve en 8004scan.io",
                  ],
                  [
                    "Required in every track",
                    "Registered from the agent's own wallet",
                    "Before the deadline: Mon Nov 9",
                    "Visible on 8004scan.io",
                  ],
                ).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <QR q={QR_ERC8004} label="Docs" url="docs.celo.org/build-on-celo/build-with-ai/8004" />
            </div>
          </div>
        </>
      ),
    },
    // loops house
    {
      node: (
        <div className="bs-split">
          <div>
            <div className="bs-loops">
              <img src="/builder-session/loops.png" alt="" />
              <Label k="HOSTED_ON" v={<span className="bs-white">LOOPS HOUSE</span>} />
            </div>
            <h2 className="bs-h2">
              {t("Para competir, inscribite sí o sí en Loops House.", "To compete, you must enroll on Loops House.")}
            </h2>
            <ol className="bs-ol">
              <li>
                {t("Entrá a ", "Go to ")}
                <A href="https://www.loops.house/agents-on-open-rails">loops.house/agents-on-open-rails</A>
                {t(", tocá ", ", click ")}
                <b>Enroll now</b>
                {t(" e iniciá sesión. Ahí te dan tu attribution tag.", " and log in. Your attribution tag is issued there.")}
              </li>
              <li>
                {t(
                  "Sumá la skill de la hackathon a tu coding agent (Node 20.12+):",
                  "Add the hackathon skill to your coding agent (Node 20.12+):",
                )}
                <Cmd>npx loopshouse add agents-on-open-rails</Cmd>
              </li>
              <li>
                {t(
                  "Etiquetá cada transacción y agregá la wallet de tu agente a tu entry.",
                  "Tag every transaction and add your agent's wallet to your entry.",
                )}
              </li>
              <li>
                {t(
                  "Registrá la identidad ERC-8004 y enviá antes del lunes 9/11 a las 06:00.",
                  "Register the ERC-8004 identity and submit before Mon Nov 9, 09:00 GMT.",
                )}
              </li>
            </ol>
          </div>
          <QR q={QR_LOOPS} label={t("Inscribite acá", "Enroll here")} url="loops.house/agents-on-open-rails" />
        </div>
      ),
    },
    // help
    {
      node: (
        <>
          <Label k={t("AYUDA", "HELP")} v={t("no te trabes solo", "don't get stuck alone")} />
          <h2 className="bs-h2">{t("Empezá a construir.", "Start building.")}</h2>
          <div className="bs-help">
            <div>
              <em>{t("01 · COMUNIDAD", "01 · COMMUNITY")}</em>
              <b>{t("Telegram de la hackathon", "Hackathon Telegram")}</b>
              <span>
                {t(
                  "El equipo global de DevRel de Celo responde ahí. Escribí en inglés así te contestan más rápido.",
                  "Celo's global DevRel team answers there. Write in English for faster replies.",
                )}
              </span>
            </div>
            <div>
              <em>02 · FEEDBACK</em>
              <b>Office hours</b>
              <span>{t("Todos los jueves a las 09:00 (hora argentina).", "Every Thursday, 12:00 GMT.")}</span>
            </div>
            <div>
              <em>03 · INFRA</em>
              <b>{t("Chainstack gratis", "Free Chainstack")}</b>
              <span>{t("3 meses del plan Growth para cada equipo.", "3 months of the Growth plan for every team.")}</span>
            </div>
            <div>
              <em>{t("04 · DESPUÉS", "04 · AFTER")}</em>
              <b>{t("Grants en Prezenti", "Grants on Prezenti")}</b>
              <span>
                {t(
                  "US$165K disponibles esta temporada para seguir construyendo.",
                  "US$165K available this season to keep building.",
                )}
              </span>
            </div>
          </div>
          <div className="bs-qrs bs-qrs-sep">
            <QR q={QR_TELEGRAM} label="Telegram" url="t.me/realworldagentshackathon" />
            <QR q={QR_CELOPEDIA} label="Celopedia" url="celopedia.celo.org" />
            <QR q={QR_LOOPS} label="Loops House" url="loops.house/agents-on-open-rails" />
          </div>
        </>
      ),
    },
    // close
    {
      node: (
        <div className="bs-cover">
          <div className="bs-cover-l">
            <div className="bs-serif bs-event">Agents on Open Rails Hackathon</div>
            <h1 className="bs-h1">
              {t("Manos a", "Let's")}
              <br />
              {t("la obra.", "build.")}
            </h1>
            <div className="bs-tag">
              {t("/ Cierre: lunes 9/11, 06:00 (hora argentina)", "/ Deadline: Mon Nov 9, 09:00 GMT")}
              <br />
              &nbsp; {t("Ganadores: viernes 13/11", "Winners: Fri Nov 13")}
            </div>
            <Logos />
          </div>
          <div className="bs-cover-qrs">
            <QR q={QR_DECK} label={t("Estas slides", "These slides")} url="arturogrande.com/builder-session" />
            <QR q={QR_LOOPS} label={t("Inscribite", "Enroll")} url="loops.house/agents-on-open-rails" />
          </div>
        </div>
      ),
    },
  ]
}

/* ---------- page ---------- */
type ExportWindow = Window & { __bsCapture?: (k: number) => Promise<string>; __bsTotal?: number }

export default function BuilderSessionPage() {
  const [i, setI] = useState(0)
  const [lang, setLang] = useState<Lang>("es")
  const SLIDES = slides(lang)
  const total = SLIDES.length
  const go = useCallback((d: number) => setI((s) => Math.max(0, Math.min(total - 1, s + d))), [total])
  const [promptOk, setPromptOk] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  // ?export=1 renders a bare 1280x720 deck (no header or controls) that the PNG export captures inside an iframe.
  const [modoExport, setModoExport] = useState(false)
  const [png, setPng] = useState<string | null>(null)
  const copiarPrompt = () =>
    navigator.clipboard?.writeText(PROMPT_LLM[lang]).then(() => {
      setPromptOk(true)
      setTimeout(() => setPromptOk(false), 1600)
    })

  // Language and slide live in the URL (?lang=en&s=5) so a link opens exactly where you want.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get("lang") === "en") setLang("en")
    if (q.get("export") === "1") setModoExport(true)
    const n = Number(q.get("s"))
    if (n >= 1) setI(Math.min(n, total) - 1)
  }, [total])
  const elegirIdioma = (l: Lang) => {
    setLang(l)
    const url = new URL(window.location.href)
    if (l === "en") url.searchParams.set("lang", "en")
    else url.searchParams.delete("lang")
    window.history.replaceState(null, "", url)
  }
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Export frame: exposes a capture function the parent page calls slide by slide.
  useEffect(() => {
    if (!modoExport) return
    const w = window as unknown as ExportWindow
    w.__bsTotal = total
    w.__bsCapture = async (k: number) => {
      setI(k)
      await new Promise((r) => setTimeout(r, 200))
      await Promise.all(
        Array.from(document.images).map((img) =>
          img.complete ? null : new Promise((r) => img.addEventListener("load", r, { once: true })),
        ),
      )
      await document.fonts.ready
      const { toPng } = await import("html-to-image")
      return toPng(rootRef.current as HTMLElement, { width: 1280, height: 720, pixelRatio: 1.5, backgroundColor: BG })
    }
  }, [modoExport, total])

  // Downloads every slide as a 1920x1080 PNG, zipped. Only the slide is captured, not the deck chrome.
  const descargarPNG = async () => {
    if (png) return
    setPng("…")
    const frame = document.createElement("iframe")
    frame.style.cssText = "position:fixed;left:-20000px;top:0;width:1280px;height:720px;border:0;"
    frame.src = `${window.location.pathname}?export=1${lang === "en" ? "&lang=en" : ""}`
    document.body.appendChild(frame)
    try {
      await new Promise((r) => frame.addEventListener("load", r, { once: true }))
      const fw = frame.contentWindow as unknown as ExportWindow
      for (let t = 0; t < 100 && !fw.__bsCapture; t++) await new Promise((r) => setTimeout(r, 100))
      if (!fw.__bsCapture) throw new Error("export frame not ready")
      const { default: JSZip } = await import("jszip")
      const zip = new JSZip()
      const n = fw.__bsTotal ?? total
      for (let k = 0; k < n; k++) {
        setPng(`${k + 1}/${n}`)
        const url = await fw.__bsCapture(k)
        zip.file(`${String(k + 1).padStart(2, "0")}.png`, url.split(",")[1], { base64: true })
      }
      const blob = await zip.generateAsync({ type: "blob" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `builder-session-slides-${lang}.zip`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 10000)
    } catch {
      window.alert(lang === "es" ? "No se pudieron exportar las slides. Probá de nuevo." : "Couldn't export the slides. Try again.")
    } finally {
      frame.remove()
      setPng(null)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Let a focused video keep its own controls (space = play/pause).
      if ((e.target as HTMLElement)?.tagName === "VIDEO" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault()
        go(1)
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault()
        go(-1)
      } else if (e.key === "Home") {
        setI(0)
      } else if (e.key === "End") {
        setI(total - 1)
      } else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen?.()?.catch(() => {})
        else document.documentElement.requestFullscreen?.()?.catch(() => {})
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, total])

  // Swipe on phones and tablets.
  useEffect(() => {
    let x0: number | null = null
    const start = (e: TouchEvent) => (x0 = e.touches[0].clientX)
    const end = (e: TouchEvent) => {
      if (x0 === null) return
      const dx = e.changedTouches[0].clientX - x0
      if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
      x0 = null
    }
    window.addEventListener("touchstart", start, { passive: true })
    window.addEventListener("touchend", end)
    return () => {
      window.removeEventListener("touchstart", start)
      window.removeEventListener("touchend", end)
    }
  }, [go])

  const es = lang === "es"
  return (
    <LangCtx.Provider value={lang}>
      <div className={modoExport ? "bs-root bs-exp" : "bs-root"} ref={rootRef}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="bs-grid" aria-hidden />
        <div className="bs-px" aria-hidden>
          <i style={{ top: "14%", right: "6%" }} />
          <i style={{ top: "62%", left: "3%" }} />
          <i style={{ bottom: "16%", right: "18%" }} />
        </div>

        <header className="bs-top">
          <div className="bs-top-l">
            <div className="bs-brand">
              <span className="bs-dot" /> STABLE AGENTS: LATAM IRL
            </div>
            <button
              className="bs-tool bs-copy"
              onClick={copiarPrompt}
              title={
                es
                  ? "Copia todo el contexto de la hackathon para pegarlo en tu coding agent o LLM"
                  : "Copies the full hackathon context to paste into your coding agent or LLM"
              }
            >
              {promptOk ? (es ? "copiado ✓" : "copied ✓") : es ? "Copiar prompt" : "Copy prompt"}
            </button>
          </div>
          <div className="bs-top-r">
            <div className="bs-lang" role="group" aria-label={es ? "Idioma" : "Language"}>
              {(["es", "en"] as Lang[]).map((l) => (
                <button key={l} className={lang === l ? "on" : ""} aria-pressed={lang === l} onClick={() => elegirIdioma(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              className="bs-tool"
              onClick={descargarPNG}
              disabled={!!png}
              title={
                es
                  ? "Descargar cada slide como PNG (1920×1080) en un .zip"
                  : "Download every slide as a PNG (1920×1080) in a .zip"
              }
            >
              {png ? `PNG ${png}` : "PNG ↓"}
            </button>
            <span className="bs-count">
              {String(i + 1).padStart(2, "0")} / {total}
            </span>
          </div>
        </header>
        <div className="bs-prog">
          <div style={{ width: `${((i + 1) / total) * 100}%` }} />
        </div>

        <main className="bs-stage">
          <div className="bs-slide" key={`${i}-${lang}`}>
            {SLIDES[i].node}
          </div>
        </main>

        <footer className="bs-ctrl">
          <button className="bs-arrow" onClick={() => go(-1)} disabled={i === 0} aria-label={es ? "Anterior" : "Previous"}>
            ←
          </button>
          <div className="bs-dots">
            {SLIDES.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} className={k === i ? "on" : ""} />
            ))}
          </div>
          <button
            className="bs-arrow"
            onClick={() => go(1)}
            disabled={i === total - 1}
            aria-label={es ? "Siguiente" : "Next"}
          >
            →
          </button>
        </footer>
        <div className="bs-hint">{es ? "← → para pasar · F pantalla completa" : "← → to navigate · F fullscreen"}</div>

        <div className="bs-print" aria-hidden>
          {SLIDES.map((sl, k) => (
            <section className="bs-print-page" key={k}>
              <div className="bs-print-body">{sl.node}</div>
            </section>
          ))}
        </div>
      </div>
    </LangCtx.Provider>
  )
}

const CSS = `
.bs-root{--bg:${BG};--text:#FFFFFF;--muted:#B8B8B8;--soft:#D8D8D8;--line:rgba(255,255,255,.12);--panel:rgba(255,255,255,.035);--green:${GREEN};--yellow:${YELLOW};--mono:var(--font-jbm),ui-monospace,Menlo,monospace;--serif:var(--font-serif4),Georgia,serif;position:fixed;inset:0;background:var(--bg);color:var(--text);display:flex;flex-direction:column;overflow:hidden;font-family:var(--mono);}
.bs-grid{position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:22px 22px;}
.bs-grid:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 0 31%,rgba(255,255,255,.07) 31% calc(31% + 1px),transparent 0 72%,rgba(255,255,255,.06) 72% calc(72% + 1px),transparent 0);}
.bs-px i{position:absolute;width:22px;height:22px;background:rgba(255,255,255,.08);box-shadow:22px 0 0 rgba(255,255,255,.05),0 22px 0 rgba(255,255,255,.04);}
.bs-dot{width:8px;height:8px;background:var(--green);display:inline-block;box-shadow:0 0 12px rgba(61,220,132,.8);}
.bs-top{position:relative;z-index:3;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px 26px;}
.bs-top-l{display:flex;align-items:center;gap:14px;min-width:0;}
.bs-brand{display:flex;align-items:center;gap:10px;font-size:12.5px;letter-spacing:.08em;white-space:nowrap;}
.bs-tool.bs-copy{color:var(--green);border-color:rgba(61,220,132,.45);}
.bs-copy:hover{background:rgba(61,220,132,.12);}
.bs-top-r{display:flex;align-items:center;gap:12px;}
.bs-tool{font-family:var(--mono);background:none;border:1px solid var(--line);color:var(--text);font-size:12px;padding:7px 12px;cursor:pointer;letter-spacing:.06em;}
.bs-tool:hover{border-color:var(--green);}
.bs-lang{display:flex;border:1px solid var(--line);}
.bs-lang button{font-family:var(--mono);font-size:12px;letter-spacing:.08em;background:none;border:none;color:var(--muted);padding:7px 11px;cursor:pointer;}
.bs-lang button+button{border-left:1px solid var(--line);}
.bs-lang button.on{background:var(--green);color:var(--bg);font-weight:600;}
.bs-lang button:not(.on):hover{color:var(--text);}
.bs-count{font-size:12.5px;color:var(--muted);letter-spacing:.1em;}
@media(max-width:640px){.bs-brand{font-size:0;gap:0;}.bs-count{display:none;}.bs-top{padding:12px 16px;}}
.bs-prog{position:relative;z-index:3;height:2px;margin:0 26px;background:rgba(255,255,255,.08);}
.bs-prog>div{height:100%;background:var(--green);transition:width .3s;}
.bs-stage{position:relative;z-index:2;flex:1;display:flex;align-items:center;justify-content:center;padding:clamp(18px,3.4vw,52px);overflow-y:auto;}
.bs-slide{width:100%;max-width:1120px;animation:bsIn .28s ease;margin:auto 0;}
@keyframes bsIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
/* type */
.bs-serif{font-family:var(--serif);}
.bs-label{font-size:clamp(11.5px,1.25vw,14.5px);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:min(2vh,16px);}
.bs-label span{color:var(--muted);}
.bs-white{color:var(--text);}
.bs-yellow{color:var(--yellow);}
.bs-h1{font-weight:400;font-size:clamp(40px,min(7.6vw,11vh),104px);line-height:1.02;letter-spacing:-.03em;margin:min(2.2vh,18px) 0 min(3vh,26px);}
.bs-h2{font-weight:400;font-size:clamp(22px,min(3.1vw,5.6vh),42px);line-height:1.14;letter-spacing:-.025em;margin:0 0 min(3vh,24px);max-width:26ch;}
.bs-p{font-family:var(--mono);font-size:clamp(14px,1.55vw,18px);line-height:1.6;color:var(--soft);margin:0 0 20px;max-width:62ch;}
.bs-p b{color:var(--text);font-weight:600;}
.bs-foot{font-size:clamp(12.5px,1.3vw,15px);line-height:1.6;color:var(--muted);margin:22px 0 0;max-width:80ch;}
.bs-mini{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:6px 0 10px;}
.bs-link{color:var(--green);text-decoration:none;border-bottom:1px solid rgba(61,220,132,.4);}
.bs-link:hover{border-bottom-color:var(--green);}
.bs-slide code,.bs-print code{font-family:var(--mono);font-size:.9em;color:var(--green);}
.bs-ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:min(1vh,9px);}
.bs-ul li{position:relative;padding-left:22px;font-size:clamp(13.5px,1.45vw,16.5px);line-height:1.5;color:var(--soft);}
.bs-ul li:before{content:"/";position:absolute;left:2px;color:var(--green);}
.bs-ol{margin:0;padding:0;list-style:none;counter-reset:n;display:flex;flex-direction:column;gap:14px;}
.bs-ol li{counter-increment:n;position:relative;padding-left:44px;font-size:clamp(13.5px,1.45vw,16.5px);line-height:1.55;color:var(--soft);}
.bs-ol li:before{content:"0" counter(n);position:absolute;left:0;top:0;color:var(--green);}
.bs-ol b{color:var(--text);}
.bs-ol .bs-cmd{margin:10px 0 0;}
/* command */
.bs-cmd{position:relative;background:#050506;border:1px solid var(--line);margin:0 0 14px;}
.bs-cmd pre{margin:0;padding:14px 92px 14px 16px;font-family:var(--mono);font-size:clamp(12px,1.35vw,14.5px);line-height:1.55;color:var(--text);white-space:pre-wrap;word-break:break-word;max-height:38vh;overflow:auto;}
.bs-cmd button{position:absolute;top:8px;right:8px;font-family:var(--mono);font-size:11px;letter-spacing:.06em;color:var(--green);background:transparent;border:1px solid rgba(61,220,132,.45);padding:6px 10px;cursor:pointer;}
.bs-cmd button:hover{background:rgba(61,220,132,.12);}
/* cover */
.bs-cover{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:24px;align-items:center;}
.bs-event{font-size:clamp(20px,2.4vw,30px);letter-spacing:-.01em;}
.bs-tag{font-size:clamp(13px,min(1.7vw,2.6vh),20px);line-height:1.5;color:var(--green);text-transform:uppercase;letter-spacing:.02em;margin-bottom:min(3vh,26px);}
.bs-cover-meta{display:flex;flex-direction:column;gap:2px;margin-bottom:min(3.6vh,30px);}
.bs-cover-meta .bs-label{margin:0;color:var(--text);}
.bs-cover-meta .bs-label span{color:var(--muted);}
.bs-cover-map{width:100%;max-height:62vh;object-fit:contain;-webkit-mask-image:radial-gradient(ellipse 72% 70% at 55% 50%,#000 60%,transparent 100%);mask-image:radial-gradient(ellipse 72% 70% at 55% 50%,#000 60%,transparent 100%);}
.bs-cover-qrs{display:flex;gap:22px;justify-content:center;}
.bs-cover-qrs .bs-qr span{max-width:170px;}
.bs-logos{display:flex;align-items:center;gap:22px;}
.bs-logos i{width:1px;height:34px;background:rgba(255,255,255,.35);}
.bs-logo-celo{height:clamp(22px,2.6vw,32px);}
.bs-logo-ripio{height:clamp(26px,3vw,38px);}
@media(max-width:860px){.bs-cover{grid-template-columns:minmax(0,1fr);}.bs-cover-map{max-height:34vh;}}
/* split */
.bs-split{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);gap:40px;align-items:center;}
.bs-split-map{width:100%;max-height:56vh;object-fit:contain;-webkit-mask-image:radial-gradient(ellipse 72% 70% at 55% 50%,#000 60%,transparent 100%);mask-image:radial-gradient(ellipse 72% 70% at 55% 50%,#000 60%,transparent 100%);}
.bs-split-art{width:100%;border:1px solid var(--line);}
@media(max-width:860px){.bs-split{grid-template-columns:minmax(0,1fr);gap:26px;}.bs-split-map,.bs-split-art{max-height:30vh;width:auto;max-width:100%;}}
/* agenda */
.bs-agbar{display:flex;gap:6px;margin-bottom:22px;}
.bs-agbar i{flex-basis:0;height:10px;background:rgba(255,255,255,.22);}
.bs-agbar i:nth-child(2){background:var(--green);}
.bs-agbar i:nth-child(3){background:rgba(252,255,82,.75);}
.bs-agenda{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px;}
.bs-ag{display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--line);padding-top:14px;}
.bs-ag:nth-child(1) b{color:var(--muted);}
.bs-ag:nth-child(2) b{color:var(--green);}
.bs-ag:nth-child(3) b{color:var(--yellow);}
.bs-ag b{font-weight:400;font-size:clamp(22px,min(2.6vw,4.4vh),34px);}
.bs-ag em{font-style:normal;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);}
.bs-ag strong{font-weight:600;font-size:clamp(15px,1.7vw,20px);margin-top:6px;}
.bs-ag span{font-size:clamp(12.5px,1.35vw,15.5px);line-height:1.55;color:var(--soft);}
@media(max-width:720px){.bs-agenda{grid-template-columns:minmax(0,1fr);gap:20px;}}
/* sedes */
.bs-sedes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
.bs-sede{display:flex;flex-direction:column;gap:2px;padding:10px 14px;border:1px solid var(--line);background:var(--panel);text-decoration:none;color:var(--text);transition:border-color .2s;}
.bs-sede:hover{border-color:rgba(61,220,132,.6);}
.bs-sede.on{border-color:var(--green);background:rgba(61,220,132,.08);}
.bs-sede b{font-weight:600;font-size:clamp(15px,1.6vw,19px);}
.bs-sede-host{color:var(--green);font-size:clamp(12.5px,1.3vw,15px);}
.bs-sede-lugar{color:var(--muted);font-size:clamp(11.5px,1.15vw,13px);line-height:1.4;}
@media(max-width:560px){.bs-sedes{grid-template-columns:minmax(0,1fr);}}
/* stats */
.bs-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:20px;}
.bs-stats div{border-top:1px solid var(--line);padding-top:16px;display:flex;flex-direction:column;gap:10px;}
.bs-stats b{font-family:var(--serif);font-weight:400;font-size:clamp(40px,6.4vw,84px);line-height:1;color:var(--yellow);letter-spacing:-.02em;}
.bs-stats span{font-size:clamp(11.5px,1.2vw,14px);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);}
@media(max-width:760px){.bs-stats{grid-template-columns:repeat(2,minmax(0,1fr));}}
.bs-kv{display:flex;flex-direction:column;gap:2px;}
.bs-kv .bs-label{margin:0;font-size:clamp(12.5px,1.4vw,16px);}
/* tracks */
.bs-tracks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;}
.bs-track{display:flex;flex-direction:column;gap:8px;border:1px solid var(--line);background:var(--panel);padding:0 0 16px;}
.bs-track img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:60% 60%;border-bottom:2px solid var(--c);}
.bs-track em,.bs-track b,.bs-track p,.bs-track strong{padding:0 15px;}
.bs-track em{font-style:normal;font-size:10.5px;letter-spacing:.1em;color:var(--c);margin-top:6px;}
.bs-track b{font-weight:600;font-size:clamp(14px,1.45vw,17px);line-height:1.25;}
.bs-track p{margin:0;font-size:clamp(12px,1.2vw,13.5px);line-height:1.5;color:var(--muted);flex:1;}
.bs-track strong{font-family:var(--serif);font-weight:400;font-size:clamp(20px,2.2vw,28px);color:var(--yellow);}
@media(max-width:900px){.bs-tracks{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media(max-width:520px){.bs-tracks{grid-template-columns:minmax(0,1fr);}.bs-track img{aspect-ratio:3/1;}}
/* track 1 */
.bs-crit{border:1px solid var(--line);border-left:2px solid var(--green);padding:14px 18px;background:var(--panel);}
.bs-crit-t{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--green);margin-bottom:12px;}
.bs-trk-r{display:flex;flex-direction:column;gap:14px;}
.bs-trk-r img{width:100%;aspect-ratio:21/9;object-fit:cover;object-position:60% 60%;border:1px solid var(--line);border-bottom:2px solid var(--c);}
.bs-trk-prizes{display:flex;gap:22px;}
.bs-trk-prizes div{flex:1;border-top:1px solid var(--line);padding-top:10px;}
.bs-trk-prizes em{display:block;font-style:normal;font-size:11px;letter-spacing:.1em;color:var(--muted);margin-bottom:6px;}
.bs-trk-prizes b{font-family:var(--serif);font-weight:400;font-size:clamp(34px,min(4.4vw,7vh),60px);line-height:1;color:var(--yellow);}
.bs-trk-links{display:flex;gap:16px;flex-wrap:wrap;font-size:clamp(12px,1.25vw,14.5px);}
.bs-trk .bs-crit{border-left-color:var(--c);padding:12px 14px;}
.bs-trk .bs-ul li{font-size:clamp(12px,min(1.3vw,2.1vh),15px);}
.bs-trk.bs-split{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:start;}
@media(max-width:860px){.bs-trk.bs-split{grid-template-columns:minmax(0,1fr);}}
.bs-trk .bs-crit-t,.bs-trk .bs-ul li:before{color:var(--c);}
.bs-trk .bs-p{font-size:clamp(13px,min(1.45vw,2.3vh),17px);margin-bottom:12px;}
.bs-trk .bs-cmd pre{padding-top:10px;padding-bottom:10px;}
.bs-prize{display:flex;flex-direction:column;gap:18px;}
.bs-prize div{border-top:1px solid var(--line);padding-top:14px;}
.bs-prize em{display:block;font-style:normal;font-size:12px;letter-spacing:.1em;color:var(--muted);margin-bottom:8px;}
.bs-prize b{font-family:var(--serif);font-weight:400;font-size:clamp(52px,7vw,92px);line-height:1;color:var(--yellow);}
/* tokens */
.bs-tokens{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
.bs-token{display:grid;grid-template-columns:36px auto;grid-template-rows:auto auto;column-gap:12px;row-gap:6px;align-items:center;border:1px solid var(--line);background:var(--panel);padding:10px 14px;min-width:0;}
.bs-token img{width:36px;height:36px;grid-row:1;}
.bs-token div{display:flex;flex-direction:column;gap:2px;}
.bs-token div b{font-size:clamp(15px,1.6vw,19px);font-weight:600;}
.bs-token div span{font-size:12px;color:var(--muted);}
.bs-token code{grid-column:1/-1;font-size:clamp(10.5px,1.05vw,12.5px)!important;color:var(--soft)!important;word-break:break-all;}
@media(max-width:720px){.bs-tokens{grid-template-columns:minmax(0,1fr);}}
/* cards */
.bs-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:18px;}
.bs-card{border:1px solid var(--line);background:var(--panel);padding:18px 20px;}
.bs-card-t{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--green);margin-bottom:10px;}
.bs-card p{margin:0;font-size:clamp(13px,1.35vw,15.5px);line-height:1.65;color:var(--soft);}
.bs-card b{color:var(--text);}
@media(max-width:720px){.bs-two{grid-template-columns:minmax(0,1fr);}}
/* ideas */
.bs-ideas{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.bs-idea{border:1px solid var(--line);background:var(--panel);padding:16px 18px;display:flex;flex-direction:column;gap:8px;}
.bs-idea b{font-weight:600;font-size:clamp(14.5px,1.5vw,18px);color:var(--green);}
.bs-idea span{font-size:clamp(12.5px,1.3vw,15px);line-height:1.55;color:var(--soft);}
@media(max-width:860px){.bs-ideas{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media(max-width:520px){.bs-ideas{grid-template-columns:minmax(0,1fr);}}
/* vercel + eve logos */
.bs-vercel{display:flex;align-items:center;gap:18px;margin:0 0 min(2.6vh,22px);}
.bs-vercel i{width:1px;height:28px;background:rgba(255,255,255,.35);}
.bs-vercel-word{height:clamp(22px,min(2.6vw,4vh),32px);}
.bs-vercel-eve{height:clamp(16px,min(1.9vw,3vh),24px);}
.bs-stats-3{grid-template-columns:repeat(3,1fr);}
.bs-infra{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-top:min(4vh,32px);}
.bs-infra span{border-top:1px solid var(--line);padding-top:12px;font-size:clamp(13px,1.45vw,17px);line-height:1.4;color:var(--text);}
@media(max-width:760px){.bs-stats-3{grid-template-columns:minmax(0,1fr);}.bs-infra{grid-template-columns:repeat(2,minmax(0,1fr));}}
.bs-ag-ul{gap:4px;}
.bs-ag-ul li{font-size:clamp(12px,1.25vw,14.5px);line-height:1.4;}
.bs-qrs-3{justify-content:flex-start;gap:clamp(20px,4vw,48px);}
.bs-qrs-sep{justify-content:center;border-top:1px solid var(--line);padding-top:min(3.4vh,26px);margin-top:min(1vh,8px);}
.bs-qrs-sep .bs-qr-card svg{width:clamp(80px,min(10vw,14.5vh),130px);height:clamp(80px,min(10vw,14.5vh),130px);}
.bs-qrs-sep{margin-bottom:0;}
.bs-demo .bs-step em{font-style:normal;font-size:clamp(12px,1.25vw,14.5px);line-height:1.5;color:var(--soft);}
.bs-demo{margin-bottom:22px;}
.bs-demo .bs-step{padding:18px;gap:10px;}
.bs-rules ul{margin-top:2px;}
.bs-id{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;}
.bs-id>div{border:1px solid var(--line);border-left:2px solid var(--yellow);background:var(--panel);padding:16px 18px;display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto 1fr;column-gap:16px;row-gap:12px;align-items:start;}
.bs-id-t{grid-column:1/-1;display:flex;align-items:baseline;gap:12px;}
.bs-id-t b{font-weight:600;font-size:clamp(16px,1.7vw,20px);}
.bs-id-t em{font-style:normal;font-size:12px;letter-spacing:.1em;color:var(--yellow);}
.bs-id .bs-qr-card svg{width:clamp(84px,min(9vw,15vh),120px);height:clamp(84px,min(9vw,15vh),120px);}
.bs-id .bs-qr span{max-width:150px;}
@media(max-width:860px){.bs-id{grid-template-columns:minmax(0,1fr);}.bs-id>div{grid-template-columns:minmax(0,1fr);}}
/* Alcancía example */
.bs-video{position:relative;width:100%;max-width:min(1060px,calc(50vh * 16 / 9));margin:0 auto;border-radius:14px;overflow:hidden;border:1px solid var(--line);background:#000;aspect-ratio:16/9;}
.bs-video video,.bs-video-still{width:100%;height:100%;display:block;object-fit:cover;}
.bs-video-still{display:none;}
.bs-exp .bs-video video{display:none;}
.bs-exp .bs-video-still{display:block;}
.bs-frames{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;max-width:min(1120px,calc(46vh * 8 / 3));margin:0 auto;}
.bs-frames img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px;border:1px solid var(--line);display:block;}
.bs-qrgrid{display:flex;justify-content:center;flex-wrap:nowrap;gap:clamp(14px,2.4vw,32px);margin-top:min(3vh,24px);}
@media(max-width:860px){.bs-qrgrid{flex-wrap:wrap;}}
.bs-qrgrid .bs-qr-card svg{width:clamp(90px,min(11vw,24vh),170px);height:clamp(90px,min(11vw,24vh),170px);}
.bs-qrgrid .bs-qr b{font-size:clamp(14px,1.5vw,18px);}
.bs-qrgrid .bs-qr span{max-width:180px;}
.bs-loops-shot{display:block;width:auto;max-width:100%;max-height:48vh;margin:0 auto;border-radius:14px;border:1px solid var(--line);}
@media(max-width:720px){.bs-frames{grid-template-columns:repeat(2,minmax(0,1fr));}}
/* eve tree */
.bs-tree{margin:0;border:1px solid var(--line);background:#050506;padding:20px 22px;font-family:var(--mono);font-size:clamp(12px,1.3vw,15px);line-height:1.9;color:var(--soft);overflow:auto;}
/* steps */
.bs-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.bs-step{border:1px solid var(--line);background:var(--panel);padding:14px 15px;display:flex;flex-direction:column;gap:7px;min-width:0;}
.bs-step span{color:var(--green);font-size:12px;}
.bs-step b{font-weight:600;font-size:clamp(13.5px,1.4vw,16px);}
.bs-step code{font-size:clamp(10.5px,1.05vw,12px)!important;color:var(--muted)!important;word-break:break-word;}
@media(max-width:860px){.bs-steps{grid-template-columns:repeat(2,minmax(0,1fr));}}
/* rules */
.bs-rules{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
.bs-rules div{border:1px solid var(--line);border-left:2px solid var(--yellow);background:var(--panel);padding:15px 17px;display:flex;flex-direction:column;gap:7px;}
.bs-rules b{font-weight:600;font-size:clamp(14.5px,1.5vw,18px);}
.bs-rules span{font-size:clamp(12.5px,1.3vw,15px);line-height:1.55;color:var(--soft);}
@media(max-width:720px){.bs-rules{grid-template-columns:minmax(0,1fr);}}
/* loops */
.bs-loops{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
.bs-loops img{width:42px;image-rendering:pixelated;}
.bs-loops .bs-label{margin:0;}
/* help */
.bs-help{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:min(3vh,22px);}
.bs-help div{border-top:1px solid var(--line);padding-top:12px;display:flex;flex-direction:column;gap:6px;}
.bs-help em{font-style:normal;font-size:11px;letter-spacing:.1em;color:var(--green);}
.bs-help b{font-weight:600;font-size:clamp(14px,1.45vw,17px);}
.bs-help span{font-size:clamp(12px,1.2vw,14px);line-height:1.5;color:var(--muted);}
@media(max-width:860px){.bs-help{grid-template-columns:repeat(2,minmax(0,1fr));}}
/* qr */
.bs-qrs{display:flex;gap:26px;flex-wrap:wrap;margin-bottom:26px;}
.bs-qr{display:flex;flex-direction:column;align-items:center;gap:8px;text-decoration:none;color:var(--text);}
.bs-qr-card{background:#fff;padding:10px;line-height:0;}
.bs-qr-card svg{width:clamp(96px,min(13vw,19vh),160px);height:clamp(96px,min(13vw,19vh),160px);display:block;}
.bs-qr b{font-weight:600;font-size:clamp(12.5px,1.3vw,15px);}
.bs-qr span{font-size:clamp(10.5px,1.05vw,12.5px);color:var(--green);text-align:center;max-width:220px;word-break:break-word;}
.bs-split>.bs-qr{justify-self:center;}
/* controls */
.bs-ctrl{position:relative;z-index:3;display:flex;align-items:center;justify-content:center;gap:18px;padding:8px 20px 2px;}
.bs-arrow{width:44px;height:44px;border:1px solid var(--line);background:transparent;color:var(--text);font-size:17px;cursor:pointer;font-family:var(--mono);}
.bs-arrow:hover:not(:disabled){border-color:var(--green);color:var(--green);}
.bs-arrow:disabled{opacity:.25;cursor:default;}
.bs-dots{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;max-width:60%;}
.bs-dots button{width:8px;height:8px;border:none;padding:0;cursor:pointer;background:rgba(255,255,255,.2);transition:background .2s,width .2s;}
.bs-dots button.on{width:22px;background:var(--green);}
.bs-hint{position:relative;z-index:3;text-align:center;font-size:10.5px;letter-spacing:.08em;color:rgba(255,255,255,.3);padding:8px 0 12px;}
@media(max-width:640px){.bs-hint{display:none;}}
/* PNG export frame: just the slide */
.bs-exp .bs-top,.bs-exp .bs-prog,.bs-exp .bs-ctrl,.bs-exp .bs-hint{display:none!important;}
.bs-exp .bs-stage{padding:48px 64px;overflow:hidden;}
.bs-exp .bs-slide{animation:none;}
.bs-exp .bs-cmd button{display:none;}
.bs-exp .bs-cmd pre{padding-right:16px;}
.bs-tool:disabled{opacity:.7;cursor:progress;}
/* print */
.bs-print{display:none;}
@media print{
  @page{size:1280px 720px;margin:0;}
  html,body{background:${BG}!important;margin:0!important;}
  .bs-root{position:static!important;overflow:visible!important;display:block!important;}
  .bs-top,.bs-prog,.bs-stage,.bs-ctrl,.bs-hint,.bs-px{display:none!important;}
  .bs-grid{position:fixed!important;}
  .bs-print{display:block!important;}
  .bs-print-page{position:relative;box-sizing:border-box;width:1280px;height:720px;break-after:page;overflow:hidden;padding:48px 64px;background:transparent;display:flex;align-items:center;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .bs-print-page:last-child{break-after:auto;}
  .bs-print-body{width:100%;max-width:1120px;margin:0 auto;}
  .bs-print .bs-cmd button{display:none!important;}
  .bs-print .bs-cmd pre{max-height:none;}
}
`
