import fetch from 'node-fetch';
import { existsSync, mkdirSync, writeFile } from 'fs';

const LINK_HEADER = 'link';
const NEXT_LINK = 'rel="next"';

const getNextLink = (headers) => {
    return headers.get(LINK_HEADER).split(',')
        .map(header => header.split(';'))
        .filter(header => header[1].trim() === NEXT_LINK)
        .map(header => header[0].replace(/[<>]/g, '').trim())
        .pop();
}

const getAllReleases = async () => {
    let url = 'https://api.github.com/repos/godotengine/godot-builds/releases?per_page=100';
    let releases = [];
    while (url) {
        const res = await fetch(url);
        const json = await res.json();
        releases = releases.concat(json);
        url = getNextLink(res.headers);
    }
    return releases;
}

const releases = await getAllReleases();
const writeFilePromises = [];
if(!existsSync('docs/json')) {
    mkdirSync('docs/json');
}

const mainJson = {};
releases.map(release => release.tag_name)
            .filter(name => !!name)
            .sort()
            .forEach(name => mainJson[name] = `https://drusin.github.io/gd-gh-dl-json-wrapper/json/${name}.json` );
writeFilePromises.push(writeFile('docs/json/main.json', JSON.stringify(mainJson, undefined, 2), console.error));

for (const release of releases) {
    const name = release.tag_name;
    const assets = release.assets.map(asset => {
        const { uploader: _, ...rest } = asset;
        return rest;
    });
    writeFilePromises.push(writeFile(`docs/json/${name}.json`, JSON.stringify(assets, undefined, 2), console.error));
}

await Promise.all(writeFilePromises);