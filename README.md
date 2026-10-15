# Stable Agents: LatAm IRL · Builder Session slides

Slides del workshop para las **builder sessions** de la hackathon **Agents on Open Rails** (Celo Core Co. × Ripio). Son una landing interactiva que funciona como presentación: se pasa con las flechas, está en español e inglés y trae un botón para copiar todo el contexto de la hackathon y pegárselo a tu coding agent.

**En vivo:** [arturogrande.com/builder-session](https://arturogrande.com/builder-session)

> Workshop slides for the Agents on Open Rails hackathon builder sessions (Celo Core Co. × Ripio). Interactive, keyboard-driven, in Spanish and English. English version: [arturogrande.com/builder-session?lang=en](https://arturogrande.com/builder-session?lang=en)

## Cómo se usa

| Acción | Cómo |
| --- | --- |
| Pasar de slide | `←` `→`, barra espaciadora, o swipe en el celular |
| Pantalla completa | `F` |
| Primera / última slide | `Home` / `End` |
| Cambiar idioma | Botón **ES / EN** arriba a la derecha, o `?lang=en` en la URL |
| Abrir en una slide | `?s=10` (se combina: `?lang=en&s=10`) |
| Descargar las slides | Botón **PNG ↓**: un `.zip` con cada slide en PNG de 1920×1080, sin la barra de arriba ni los controles |
| Contexto para tu coding agent | Botón **Copiar prompt**: copia tracks, reglas, direcciones de contrato, comandos y links |

## Qué cubre

23 slides:

1. Portada y agenda (15 min de llegada, 45 min de keynote, 1 h para arrancar a construir)
2. Las 6 builder sessions: Salta, Jujuy, Córdoba, Rosario, Buenos Aires y Mar del Plata
3. Celo (métricas de celo.org) y la hackathon: ventana, premios y los 4 tracks
4. Una slide por track: Stable Agents LatAm (Ripio), Textile FX, USA₮ con x402 y Build with buy
5. Recursos de Ripio: stablecoins wFiat, ramps y bridge (con QR)
6. Faucet de USA₮, ideas de agentes, Celopedia y eve (Vercel)
7. De cero a un agente y demo en vivo del host: un agente real con una transacción en mainnet
8. Reglas, attribution tag (ERC-8021) e identidad (ERC-8004), inscripción en Loops House y ayuda

## Correrlo local

Necesitás Node 20 o más.

```bash
npm install
npm run dev
```

Abrí [localhost:3000](http://localhost:3000).

## Editarlo

Todo el contenido vive en [`components/deck.tsx`](components/deck.tsx):

- `SEDES`: ciudades, hosts, lugares y links de Luma
- `TOKENS`: las stablecoins wFiat y sus direcciones
- `AGENDA`: los bloques de la agenda
- `PROMPT_LLM` y `PROMPT_AGENTE`: los prompts que se copian, en los dos idiomas
- `slides(lang)`: cada slide, con el texto en español e inglés lado a lado (`t("es", "en")`)
- `CSS`: los estilos, con la paleta del deck oficial (JetBrains Mono, Source Serif 4, amarillo Celo y un color por track)

Las imágenes y logos están en [`public/builder-session`](public/builder-session).

La descarga en PNG abre la misma página con `?export=1` dentro de un iframe invisible de 1280×720 (sin barra ni controles) y captura cada slide con [html-to-image](https://github.com/bubkoo/html-to-image). El zip se arma en el navegador con [JSZip](https://stuk.github.io/jszip/).

## Deploy

Es un proyecto Next.js estándar: importalo en [Vercel](https://vercel.com/new) y listo, sin variables de entorno.

## Créditos

Hecho por [Arturo Grande](https://arturogrande.com) para la comunidad de Celo en Argentina, con feedback de Lena Hierzi (Celo Core Co.).

El código está bajo licencia MIT. Los logos y el arte (Celo, Ripio, Loops House, Vercel, eve, Textile, buy y los tokens wFiat) pertenecen a sus respectivos dueños y se usan solo para presentar la hackathon.
