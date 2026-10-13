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
| Exportar a PDF | Botón **PDF** (una slide por página, 16:9) |
| Contexto para tu coding agent | Botón **Copiar prompt**: copia tracks, reglas, direcciones de contrato, comandos y links |

## Qué cubre

1. Portada y agenda (15 min de llegada, 45 min de keynote, 1 h de networking)
2. Las 6 builder sessions: Salta, Jujuy, Córdoba, Rosario, Buenos Aires y Mar del Plata
3. Celo y la hackathon: ventana, premios y los 4 tracks
4. Un slide por track: Stable Agents LatAm (Ripio), Textile FX, USA₮ con x402 y Build with buy
5. Recursos de Ripio: stablecoins wFiat, ramps y bridge
6. Faucet de USA₮, ideas de agentes, Celopedia y eve (Vercel)
7. De cero a un agente, demo en vivo del host
8. Reglas, attribution tag (ERC-8021), identidad (ERC-8004), inscripción en Loops House y ayuda

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

## Deploy

Es un proyecto Next.js estándar: importalo en [Vercel](https://vercel.com/new) y listo, sin variables de entorno.

## Créditos

Hecho por [Arturo Grande](https://arturogrande.com) para la comunidad de Celo en Argentina, con feedback de Lena Hierzi (Celo Core Co.).

El código está bajo licencia MIT. Los logos y el arte (Celo, Ripio, Loops House, Vercel, eve, Textile, buy y los tokens wFiat) pertenecen a sus respectivos dueños y se usan solo para presentar la hackathon.
