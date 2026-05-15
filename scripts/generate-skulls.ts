import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const ENV_PATH = resolve("/home/nuc/.openclaw/workspace/ol-co/.env.local");

function loadKey(): string {
  const fs = require("fs");
  const txt = fs.readFileSync(ENV_PATH, "utf8");
  for (const raw of txt.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("OPENAI_API_KEY=")) {
      return line.slice("OPENAI_API_KEY=".length).replace(/^["']|["']$/g, "");
    }
  }
  throw new Error("OPENAI_API_KEY not found in " + ENV_PATH);
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || loadKey();
const OUT_DIR = resolve(__dirname, "../public/species/skulls");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const SPECIES: { slug: string; prompt: string }[] = [
  {
    slug: "elk",
    prompt:
      "Front-facing flat silhouette of a Rocky Mountain bull elk skull with massive symmetrical 6x6 antlers spreading wide. Solid bone-white color #EEEAE0 on a fully transparent background. Clean vector-style hard edges, no shading, no gradients, no texture, no outline, no shadows. Centered, symmetric, antlers fully visible inside the frame. Heraldic mascot icon style.",
  },
  {
    slug: "mule-deer",
    prompt:
      "Front-facing flat silhouette of a trophy mule deer buck skull with classic forked symmetric antlers, deep forks, modest spread. Solid bone-white #EEEAE0 on fully transparent background. Flat vector silhouette, no shading, gradients, texture, outline or shadow. Centered, symmetric, antlers fully inside the frame. Heraldic mascot icon style.",
  },
  {
    slug: "whitetail",
    prompt:
      "Front-facing flat silhouette of a mature whitetail buck skull with typical 10-point symmetric rack, tall main beams curving inward, even tine length. Solid bone-white #EEEAE0 on fully transparent background. Flat vector silhouette, no shading, gradients, texture, outline or shadow. Centered, symmetric, antlers fully inside the frame. Heraldic mascot icon style.",
  },
  {
    slug: "pronghorn",
    prompt:
      "Front-facing flat silhouette of a pronghorn antelope skull with distinctive forward-hooking pronged horns and small forward prong. Solid bone-white #EEEAE0 on fully transparent background. Flat vector silhouette, no shading, gradients, texture, outline or shadow. Centered, symmetric, horns fully inside the frame. Heraldic mascot icon style.",
  },
  {
    slug: "bighorn-sheep",
    prompt:
      "Front-facing flat silhouette of a mature bighorn ram skull with massive full-curl horns sweeping down, around and back up alongside the face. Solid bone-white #EEEAE0 on fully transparent background. Flat vector silhouette, no shading, gradients, texture, outline or shadow. Centered, symmetric, horns fully inside the frame. Heraldic mascot icon style.",
  },
  {
    slug: "moose",
    prompt:
      "Front-facing flat silhouette of a bull moose skull with huge palmated paddle antlers spreading wide and slightly forward, long muzzle. Solid bone-white #EEEAE0 on fully transparent background. Flat vector silhouette, no shading, gradients, texture, outline or shadow. Centered, symmetric, palmated antlers fully inside the frame. Heraldic mascot icon style.",
  },
  {
    slug: "mountain-goat",
    prompt:
      "Front-facing flat silhouette of a mountain goat skull with slender black-tip-shaped horns curving slightly back, narrow muzzle, prominent dished face. Solid bone-white #EEEAE0 on fully transparent background. Flat vector silhouette, no shading, gradients, texture, outline or shadow. Centered, symmetric, horns fully inside the frame. Heraldic mascot icon style.",
  },
  {
    slug: "black-bear",
    prompt:
      "Front-facing flat silhouette of a black bear skull, broad cranium, prominent canines visible, no antlers. Solid bone-white #EEEAE0 on fully transparent background. Flat vector silhouette, no shading, gradients, texture, outline or shadow. Centered and symmetric. Heraldic mascot icon style.",
  },
];

async function genOne(slug: string, prompt: string): Promise<void> {
  const outPath = resolve(OUT_DIR, `${slug}.png`);
  if (existsSync(outPath)) {
    console.log(`[skip] ${slug} already exists`);
    return;
  }
  console.log(`[gen]  ${slug}…`);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      background: "transparent",
      quality: "high",
      n: 1,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI ${slug} failed ${res.status}: ${txt}`);
  }
  const data = (await res.json()) as { data: Array<{ b64_json?: string; url?: string }> };
  const item = data.data[0];
  if (item.b64_json) {
    writeFileSync(outPath, Buffer.from(item.b64_json, "base64"));
  } else if (item.url) {
    const r = await fetch(item.url);
    const buf = Buffer.from(await r.arrayBuffer());
    writeFileSync(outPath, buf);
  } else {
    throw new Error("No image data returned for " + slug);
  }
  console.log(`[ok]   ${slug} → ${outPath}`);
}

async function main() {
  const only = process.argv.slice(2);
  const targets = only.length
    ? SPECIES.filter((s) => only.includes(s.slug))
    : SPECIES;
  for (const s of targets) {
    try {
      await genOne(s.slug, s.prompt);
    } catch (e) {
      console.error(`[err]  ${s.slug}:`, (e as Error).message);
    }
  }
  console.log("done.");
}

main();
