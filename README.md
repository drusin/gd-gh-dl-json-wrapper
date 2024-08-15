# gd-dl-json-wrapper
A small node script that crowls through the [Godot download repository](https://downloads.tuxfamily.org/godotengine/) and generates a JSON file for every version containing name, download url and other metadata, plus a `main.json` as a dictionairy for all available versions.

Structure of the `main.json`:
```JSON
{
  //(...)
  "4.0.1": "https://drusin.github.io/gd-dl-json-wrapper/json/4.0.1.json",
  "4.0.1-mono": "https://drusin.github.io/gd-dl-json-wrapper/json/4.0.1-mono.json",
  "4.0.1-rc1": "https://drusin.github.io/gd-dl-json-wrapper/json/4.0.1-rc1.json",
  //(...)
}
```

Structure of a version file:
```JSON
[
  //(...)
  {
    "lastModified": "2023-Jul-06 09:46:06",
    "name": "Godot_v4.1-stable_win64.exe.zip",
    "size": "51.6M",
    "type": "application/zip"
    "url": "https://downloads.tuxfamily.org/godotengine/4.1/Godot_v4.1-stable_win64.exe.zip",
  },
  //(...)
]
```

The version names are created by naively putting together the names of the "subfolders" which are traversed, so you end up with things like `4.0-pre-alpha-4.0-dev.20210820` but that's good enough for me right now.

## Where to find the generated files
The generated json files are hosted on github.io: https://drusin.github.io/gd-dl-json-wrapper/json/main.json  
They are regenerated twice per day via Github actions.

## Legacy file
For compatibility reasons, the previously generated "flat" json file is still hosted on https://drusin.github.io/gd-dl-json-wrapper/json/output.json for now. This file is __deprecated__ and is not being regenerated/updated anymore. The readme describing its format can be found here: https://github.com/drusin/gd-dl-json-wrapper/blob/1e66ec8e5a610bab7bcefffb83b8e10b7b5bbbdd/README.md

## Running locally
Make sure you have Node 18 or later installed, then:
* clone or donwload the project
* `npm ci`
* `npm start`

This will regenerate the files in `docs/json`.