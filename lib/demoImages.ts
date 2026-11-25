import { people, titles } from "./demoData.ts";
import { DEMO_PROVIDERS } from "./providers.ts";

const FILE = /^demo-(poster|backdrop|person|still|logo)-(\d+)(?:-(\d+))?\.svg$/;

const escapeXml = (text: string) =>
  text.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

function wrap(text: string, width: number) {
  const lines = [""];
  for (const word of text.split(" ")) {
    const line = `${lines[lines.length - 1]} ${word}`.trim();
    if (line.length > width && lines[lines.length - 1]) lines.push(word);
    else lines[lines.length - 1] = line;
  }
  return lines;
}

// Four abstract scenes, coloured by the seed
function scene(w: number, h: number, seed: number) {
  const hue = (seed * 47) % 360;
  const c = (shift: number, light: number, sat = 55) =>
    `hsl(${(hue + shift) % 360} ${sat}% ${light}%)`;
  const x = w * (0.25 + ((seed * 13) % 50) / 100);
  const y = h * (0.28 + ((seed * 7) % 18) / 100);
  const r = Math.min(w, h) * (0.2 + (seed % 4) / 24);
  const art = [
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${c(40, 62, 75)}"/><path d="M0 ${h * 0.62}Q${w * 0.25} ${h * 0.45} ${w * 0.5} ${h * 0.6}T${w} ${h * 0.55}V${h}H0z" fill="${c(0, 22)}"/><path d="M0 ${h * 0.76}Q${w * 0.35} ${h * 0.6} ${w * 0.65} ${h * 0.74}T${w} ${h * 0.7}V${h}H0z" fill="${c(-15 + 360, 14)}"/>`,
    [1, 0.78, 0.56, 0.34]
      .map((k, i) => `<circle cx="${w / 2}" cy="${h * 0.42}" r="${Math.min(w, h) * 0.42 * k}" fill="${c(i * 22, 24 + i * 12)}"/>`)
      .join(""),
    [...Array(9).keys()]
      .map((i) => `<rect x="${(w / 9) * i}" y="${h * (0.3 + ((seed + i * 5) % 7) / 18)}" width="${w / 9 - 2}" height="${h}" fill="${c(i * 6, 16 + ((seed + i) % 4) * 5)}"/>`)
      .join("") + `<circle cx="${x}" cy="${h * 0.2}" r="${r * 0.6}" fill="${c(50, 70, 70)}"/>`,
    `<path d="M${w * 0.5} ${h * 0.1}L${w * 0.95} ${h * 0.75}H${w * 0.05}z" fill="${c(20, 34)}"/><path d="M${w * 0.5} ${h * 0.3}L${w * 0.8} ${h * 0.75}H${w * 0.2}z" fill="${c(45, 55, 65)}"/><rect y="${h * 0.75}" width="${w}" height="${h * 0.25}" fill="${c(0, 12)}"/>`,
  ][seed % 4];
  return `<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="${c(0, 32)}"/><stop offset="1" stop-color="${c(30, 12)}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/>${art}`;
}

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" font-family="Helvetica,Arial,sans-serif">${body}</svg>`;

// The SVG for a demo image, or null when there is no such file
export function demoImage(file: string): string | null {
  const match = FILE.exec(file);
  if (!match) return null;
  const [, kind, rawId, part] = match;
  const id = Number(rawId);
  const seed = id + Number(part ?? 0) * 5;

  if (kind === "logo") {
    const provider = DEMO_PROVIDERS.find((p) => p.id === id);
    if (!provider) return null;
    return svg(92, 92, `<rect width="92" height="92" fill="hsl(${id * 57} 55% 32%)"/><text x="46" y="61" font-size="46" font-weight="900" fill="#fff" text-anchor="middle">${provider.name[0]}</text>`);
  }

  if (kind === "person") {
    const person = people.find((p) => p.id === id);
    if (!person) return null;
    const hue = (seed * 61) % 360;
    return svg(200, 300, `<rect width="200" height="300" fill="hsl(${hue} 35% 28%)"/><circle cx="100" cy="330" r="120" fill="hsl(${hue + 40} 40% 42%)"/><rect x="82" y="150" width="36" height="70" rx="18" fill="hsl(${20 + (seed % 15)} 45% ${38 + (seed % 5) * 8}%)"/><ellipse cx="100" cy="125" rx="44" ry="54" fill="hsl(${20 + (seed % 15)} 45% ${44 + (seed % 5) * 8}%)"/><path d="M52 122a48 56 0 0 1 96 0q-18 ${-30 - (seed % 3) * 6} -48 -28t-48 28z" fill="hsl(${25 + (seed % 20)} 30% ${12 + (seed % 4) * 9}%)"/>`);
  }

  const title = titles.find((t) => t.id === id);
  if (!title) return null;
  if (kind === "backdrop") return svg(1280, 720, scene(1280, 720, seed));
  if (kind === "still") return svg(320, 180, scene(320, 180, seed));

  const lines = wrap(title.title[0], 13);
  const text = lines
    .map((line, i) => `<text x="20" y="${276 - (lines.length - 1 - i) * 25}" font-size="22" font-weight="900" fill="#fff">${escapeXml(line)}</text>`)
    .join("");
  return svg(200, 300, `${scene(200, 300, seed)}<rect y="${276 - lines.length * 25 - 14}" width="200" height="120" fill="#000" fill-opacity=".45"/>${text}`);
}
