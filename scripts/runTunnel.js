import{spawn} from 'child_process';
import path from 'path'
import { updateEnvFile } from './updateEnvFile.js';


//set path to where command is run
const envPath = path.resolve(process.cwd(), '.env');
const PORT = '5173'
const ENV_VAR_NAME = 'TUNNEL_URL'

export function runCloudflare(envVar, port, timeoutMs = 10000) {
  const url =`http://localhost:${port}`
  return new Promise((resolve, reject) => {
    const cloudflared = spawn('cloudflared', ['tunnel', '--url', url], { shell: true });

    let timeoutCF = setTimeout(() => {
      cloudflared.kill();
      reject(new Error(`cloudflared timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    cloudflared.stderr.on('data', data => {
      const output = data.toString();
      const match = output.match(/https:\/\/.*\.trycloudflare\.com/);
      if (match) {
        clearTimeout(timeoutCF);
        const tunnelUrl = match[0];
        console.log(`🌐 Tunnel URL: ${tunnelUrl}`);
        const envVal = tunnelUrl.split("//")[1];
        updateEnvFile(envVar, envVal, envPath);
        resolve(tunnelUrl);
      }
    });

    cloudflared.on('error', err=>{
      clearTimeout(timeoutCF); 
      reject(err)
    });
    
    cloudflared.on('close', code => {
      clearTimeout(timeoutCF);
      if (code !== 0) {
        reject(new Error(`cloudflared exited with code ${code}`));
      }
    });
  });
}

export function runLocalTunnel(envVar, port,timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
        const ltProcess = spawn('lt', ['--port', port], { shell: true });

          let timeoutLT = setTimeout(() => {
            ltProcess.kill();
            reject(new Error(`localtunnel timed out after ${timeoutMs / 1000}s`));
          }, timeoutMs);

        ltProcess.stdout.on('data',data=>{
            const output = data.toString();
            const match = output.match(/https:\/\/[^\s]+\.loca\.lt/);
            
            if (match) {
              clearTimeout(timeoutLT);
              const tunnelUrl = match[0];
              console.log(`🌐 Tunnel URL: ${tunnelUrl}`);
              const envVal = tunnelUrl.split("//")[1];
              updateEnvFile(envVar, envVal, envPath);
              resolve(tunnelUrl);
            }
        });
        ltProcess.on('error', err =>{
          clearTimeout(timeoutLT);
          reject(err)
        });
        ltProcess.on('close', code => {
            clearTimeout(timeoutLT)
            if (code !== 0) {
            reject(new Error(`localtunnel exited with code ${code}`));
            }
        });
    });
}

export  async function runTunnel(){
  try {
    await runCloudflare(ENV_VAR_NAME, PORT);
    console.log('Cloudflare tunnel ready');
    process.exit(0);
  } catch (err) {
    console.error('Error starting Cloudflare tunnel:', err);
    console.log('Trying on Local tunnel')
    try{
      await runLocalTunnel(ENV_VAR_NAME, PORT)
      process.exit(0)
    } catch (err) {
      console.error(`Error starting Local tunnel:`, err);
      process.exit(1);
    }
  }
}

(async () => {
  runTunnel(ENV_VAR_NAME,PORT)
})();