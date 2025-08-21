import { promises as fs } from 'fs';
import path from 'path';

async function extractColors() {
  const dir = path.join(process.cwd(), 'assets');
  const files = await fs.readdir(dir);
  const colorRegex = /#[0-9a-fA-F]{3,6}/g;
  const colors = new Set();
  for (const file of files) {
    if (!file.endsWith('.css')) continue;
    const content = await fs.readFile(path.join(dir, file), 'utf-8');
    const matches = content.match(colorRegex);
    if (matches) {
      matches.forEach(c => colors.add(c));
    }
  }
  console.log([...colors]);
}

extractColors();
