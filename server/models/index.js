import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = {};

const files = fs.readdirSync(__dirname).filter(
  (file) => file !== 'index.js' && file.endsWith('.js')
);

for (const file of files) {
  const modelName = path.basename(file, '.js');
  const modulePath = path.join(__dirname, file);
  const imported = await import(`file://${modulePath}`);
  models[modelName] = imported.default;
}

export default models;