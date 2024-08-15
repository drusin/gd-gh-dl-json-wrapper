import fetch from 'node-fetch';

const LINK_HEADER = 'link';
const NEXT_LINK = 'rel="next"';

const getNextLink = (headers) => {
    return headers.get(LINK_HEADER).split(',')
        .map(header => header.split(';'))
        .filter(header => header[1].trim() === NEXT_LINK)
        .map(header => header[0].replace(/[<>]/g, '').trim())
        .pop();
}

let url = 'https://api.github.com/repos/godotengine/godot-builds/releases?per_page=100';

while (url) {
    console.log(url);
    const res = await fetch(url);
    // await res.json();
    url = getNextLink(res.headers);
}

// const res = await fetch('https://api.github.com/repos/godotengine/godot-builds/releases?per_page=1');
// const json = await res.json();
// const header = res.headers;
// console.log(header);
// console.log(json);