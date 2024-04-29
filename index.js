const readline = require("readline");
const axios = require("axios");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const processedEpisodes = new Set();

async function processMKV1080pLinks(url) {
  try {
    if (!processedEpisodes.has(url)) {
      processedEpisodes.add(url);
      // Load HTML content from the episode URL
      const response = await axios.get(url);
      const htmlContent = response.data;

      // Use cheerio to parse HTML content
      const cheerio = require("cheerio");
      const $ = cheerio.load(htmlContent);

      // Find MKV 1080p links
      const mkv1080pLinks = $("strong")
        .filter((index, element) => $(element).text() === "MKV 1080p")
        .siblings("a");

        console.log(`----------------------------------------------------------------------------------------------------------------\n
        Episode ${url} 
        \n----------------------------------------------------------------------------------------------------------------`);


      // Print the links
      mkv1080pLinks.each((index, element) => {
        const link = $(element).attr("href");
        const anchorText = $(element).text(); // Ambil teks anchor dari tag <a>
        console.log(`Link ${anchorText} : ${link}\n`);
      });
    }
  } catch (error) {
    console.error(`Error fetching episode ${url}: ${error.message}`);
  }
}

function generateEpisodeURLs(baseURL, totalEpisodes) {
  const episodeURLs = [];
  for (let episode = 1; episode <= totalEpisodes; episode++) {
    const episodeURL = `${baseURL}${episode}-sub-indo/`;
    episodeURLs.push(episodeURL);
  }
  return episodeURLs;
}

rl.question(
  "Masukkan URL \nContoh 'https://otakudesu.cloud/episode/madome-episode-' : ",
  async (baseURL) => {
    rl.question("Masukkan total episode: ", async (totalEpisodes) => {
      const episodeURLs = generateEpisodeURLs(baseURL, parseInt(totalEpisodes));
      // Process MKV 1080p links for each episode URL
      for (const url of episodeURLs) {
        await processMKV1080pLinks(url);
      }
      rl.close();
    });
  }
);
