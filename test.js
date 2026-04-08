const url = `https://poetrydb.org/linecount,random/${getRandomInt(3,15)};1`

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

fetch(url).then(response => response.json()).then(data => console.log(data[0]))
