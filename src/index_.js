import { load } from 'cheerio';
import { writeFile } from 'fs';
import fetch from 'node-fetch';

const DL_REPOSITORY_URL = 'https://downloads.tuxfamily.org/godotengine/';
const VERSION_REGEX = /^[\d\.]+$/;
const LINK_QUERY = 'tbody td.n a';
const LINE_QUERY = 'tbody tr';


const mainPaingStr = await (await fetch(DL_REPOSITORY_URL)).text();
const mainPage = load(mainPaingStr);
const mainVersions = mainPage(LINK_QUERY)
        .toArray()
        .map(line => ({
            name: line.children[0].data,
            url: DL_REPOSITORY_URL + line.attribs.href
        }))
        .filter(line => VERSION_REGEX.test(line.name));

const versions = {};
const promises = mainVersions.map(version => traverse(version.url, version.name, versions));
await Promise.all(promises);

const mainParts = Object.keys(versions)
        .sort()
        .map(name => ({ [name]: `https://drusin.github.io/gd-dl-json-wrapper/json/${name}.json` }));
const mainJson = Object.assign({}, ...mainParts)
writeFile('docs/json/main.json', JSON.stringify(mainJson, undefined, 2), console.error);

for (const version of Object.values(versions)) {
    writeFile(`docs/json/${version.name}.json`, JSON.stringify(version.content, undefined, 2), console.error);
}

async function traverse(url, versionString, output) {
    const folderStr = await (await fetch(url)).text();
    const folder = load(folderStr);
    const allLines = folder(LINE_QUERY)
            .toArray()
            .map(line => ({
                name: line.children[0].children[0].children[0].data,
                url: url + line.children[0].children[0].attribs.href,
                lastModified: line.children[1].children[0].data,
                size: line.children[2].children[0].data,
                type: line.children[3].children[0].data
            }))
            .filter(line => line.name !== 'Parent Directory' && line.name !== 'fixup');
    
    const goingDeeper = allLines.filter(line => line.url.endsWith('/'))
            .map(line => traverse(line.url, `${versionString}-${line.name}`, output));
    await Promise.all(goingDeeper);
    
    const downloadLines = allLines.filter(line => !line.url.endsWith('/'))
    if (downloadLines.length > 0) {
        output[versionString] = {
            name: versionString,
            content: downloadLines
        };
    }
}
