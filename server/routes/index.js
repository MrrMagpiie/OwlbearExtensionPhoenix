import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = {};

const files = fs.readdirSync(__dirname).filter(
  (file) => file !== 'index.js' && file.endsWith('.js')
);

for (const file of files) {
  const routeName = path.basename(file, '.js');
  const modulePath = path.join(__dirname, file);
  const imported = await import(`file://${modulePath}`);
  routes[routeName] = imported.default;
}

export default routes;