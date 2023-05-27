const http = require('http');

const fileUrl = 'https://www.budavartours.hu/binaries/content/assets/budavar/sitemap-bvt.xml'; // A letölteni kívánt fájl URL-je

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      const contentLength = response.headers['content-length']; // A válaszban kapott fájl mérete

      const dataChunks = []; // Buffer tömb a letöltött adatok tárolásához
      let downloadedBytes = 0; // Letöltött bájtok száma

      response.on('data', (chunk) => {
        dataChunks.push(chunk); // Letöltött adat hozzáadása a Buffer tömbhöz
        downloadedBytes += chunk.length; // Letöltött adat méretének frissítése

        process.stdout.write(`Letöltve: ${downloadedBytes} bájt / ${contentLength} bájt\r`); // Kiírás a konzolra egy sorba
      });

      response.on('end', () => {
        const downloadedData = Buffer.concat(dataChunks); // Letöltött adatok összefűzése egyetlen Buffer-be

        console.log('\nLetöltés befejeződött!');
        resolve(downloadedData); // Promise teljesítése a letöltött adattal
      });
    }).on('error', (error) => {
      reject(error); // Promise elutasítása hiba esetén
    });
  });
}

async function main() {
  try {
    const downloadedData = await downloadFile(fileUrl);

    // A teljes fájl letöltése befejeződött, a letöltött adat elérhető a downloadedData változóban
    console.log('Letöltött adat hossza:', downloadedData.length, 'bájt');

    // Itt folytathatod a programot a letöltött adatokkal
  } catch (error) {
    console.error('Hiba történt a letöltés közben:', error);
  }
}

main();