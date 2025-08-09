import fs from 'fs'

export function updateEnvFile(varName, value, filePath) {
  let content = '';
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp(`^${varName}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${varName}=${value}`);
    } else {
      content += `\n${varName}=${value}`;
    }
  } else {
    content = `${varName}=${value}`;
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Wrote to .env: ${varName}=${value.trim()}`);
}