import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, 'TAP - Transit Access Pass - Los Angeles California.html');
const assetsDir = path.join(__dirname, 'assets');

async function parseHTML(html) {
  const linkRegex = /<link[^>]+href="([^"]+)"/g;
  const scriptRegex = /<script[^>]+src="([^"]+)"/g;
  const urls = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  while ((match = scriptRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function download(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = new Uint8Array(await res.arrayBuffer());
    const filename = path.basename(new URL(url).pathname) || 'index.html';
    const filepath = path.join(assetsDir, filename);
    await fs.writeFile(filepath, data);
    console.log(`Saved ${url} -> ${filename}`);
  } catch (err) {
    const filename = path.basename(new URL(url).pathname) || 'index.html';
    const filepath = path.join(assetsDir, filename);
    await fs.writeFile(filepath, `/* Failed to download ${url}: ${err.message} */`);
    console.warn(`Failed ${url}: ${err.message}`);
  }
}

async function main() {
  await fs.mkdir(assetsDir, { recursive: true });
  const html = await fs.readFile(htmlPath, 'utf-8');
  const urls = await parseHTML(html);
  for (const url of urls) {
    await download(url);
  }
}

main();
