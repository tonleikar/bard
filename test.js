const url = "https://poetrydb.org/linecount,random/3;1";

fetch(url).then(response => response.json()).then(data => console.log(data[0]))
