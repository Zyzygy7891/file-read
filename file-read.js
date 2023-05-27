
const remotefile = new URL(''); // A letölteni kívánt fájl URL-je

const connection = require(remotefile.protocol.replace(':', '')); // Az URL protokollja alapján létrehozott http vagy https
const updateInterval = 500; // Frissítési periódus (másodperc)

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    connection.get(url, (response) => {
      const logFileProgress = (downloadedBytes, contentLength, isAllMessageInOneLine=true)=>
      {
        process.stdout.write(`Letöltve: ${~~(100 * (downloadedBytes / contentLength))}% ${downloadedBytes} bájt / ${contentLength} bájt${isAllMessageInOneLine?'\r':'\n'}`);
      }

      const contentLength = response.headers['content-length']; // A válaszban kapott fájl mérete

      const dataChunks = []; // Buffer tömb a letöltött adatok tárolásához
      let downloadedBytes = 0; // Letöltött bájtok száma
      let lastUpdate = Date.now(); // Utolsó frissítés időpontja

      response.on('data', (chunk) => {
        dataChunks.push(chunk); // Letöltött adat hozzáadása a Buffer tömbhöz
        downloadedBytes += chunk.length; // Letöltött adat méretének frissítése
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastUpdate;

        if (elapsedTime >= updateInterval) {
          logFileProgress(downloadedBytes, contentLength); // Fájl készültségének és méretének kiírása egyetlen sorba
          lastUpdate = currentTime; // Frissítési időpont frissítése
        }
      });

      response.on('end', () => {
        const downloadedData = Buffer.concat(dataChunks); // Letöltött adatok összefűzése egyetlen Buffer-be

        logFileProgress(downloadedBytes, contentLength, false); // Fájl készültségének és méretének kiírása egyetlen sorba
        console.log('Letöltés befejeződött!');
        resolve(downloadedData); // Promise teljesítése a letöltött adattal
      });
    }).on('error', (error) => {
      reject(error); // Promise elutasítása hiba esetén
    });
  });
}

async function main() {
  try {
    const downloadedData = await downloadFile(remotefile);

    // A teljes fájl letöltése befejeződött, a letöltött adat elérhető a downloadedData változóban
    console.log('Letöltött adat hossza:', downloadedData.length, 'bájt');

    // Itt folytathatod a programot a letöltött adatokkal
  } catch (error) {
    console.error('Hiba történt a letöltés közben:', error);
  }
}

main();