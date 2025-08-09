import dotenv from "dotenv";
import path from 'path'
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

let manifest =`🔗 add to Owkbear Rodeo extension with: https://${process.env.TUNNEL_URL}/manifest.json`

console.log(manifest)

let halfMin = setInterval(() => {
  console.log(manifest);
}, 30000);

let tenMin = setInterval(() => {
  console.log(manifest);
}, 600000);

setTimeout(() => {
    clearInterval(halfMin)
    }, 300000);


