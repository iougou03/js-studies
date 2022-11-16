require('dotenv').config();

const http = require('http');
const { createApi } = require('unsplash-js');
const fetch = require('node-fetch');

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch,
});

/**
 * 
 * @param {string} query 
 * @returns 
 */
async function searchImage(query) {
  const result = await unsplash.search.getPhotos({
    query,
  });

  if (!result.response) {
    throw new Error('Failed to search image');
  }

  const image = result.response.results[0];

  if (!image) {
    throw new Error('No image found');
  }
  return {
    description: image.description || image.alt_description,
    url: image.urls.regular,
  };
}



const server = http.createServer((req, res) => {
    async function main() {
        const result = await searchImage('seoul');
    
        const resp = await fetch(result.url);

        resp.body.pipe(res)
    }

    main();
})


const PORT = 3000;

server.listen(PORT, () => {
    console.log(PORT)
})