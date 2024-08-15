# gd-gh-dl-json-wrapper
I find the Github releases API quite lacking - there is not possibility of filtering or reducing output, forcing you to wade through megabytes of JSON data if you are looking for a specific Godot release.
This project is a small node script that crawls through the [Godot builds repository](https://github.com/godotengine/godot-builds/releases) and generates a JSON file for every version with a slightly trimmed array of download artifacts. Additionally a `main.json` is created as a dictionary for all available versions.

Structure of the `main.json`:
```JSON
{
  //(...)
  "4.2.2-rc3": "https://drusin.github.io/gd-gh-dl-json-wrapper/json/4.2.2-rc3.json",
  "4.2.2-stable": "https://drusin.github.io/gd-gh-dl-json-wrapper/json/4.2.2-stable.json",
  "4.3-beta1": "https://drusin.github.io/gd-gh-dl-json-wrapper/json/4.3-beta1.json",
  //(...)
}
```

Structure of a version file - basically an array of Github asset entries with the _uploader_ field removed to half the size of the json:
```JSON
[
  //(...)
  {
    "url": "https://api.github.com/repos/godotengine/godot-builds/releases/assets/162583011",
    "id": 162583011,
    "node_id": "RA_kwDOKREZmc4JsNHj",
    "name": "Godot_v4.2.2-stable_win64.exe.zip",
    "label": "",
    "content_type": "application/zip",
    "state": "uploaded",
    "size": 48710790,
    "download_count": 8225,
    "created_at": "2024-04-17T07:44:46Z",
    "updated_at": "2024-04-17T07:44:52Z",
    "browser_download_url": "https://github.com/godotengine/godot-builds/releases/download/4.2.2-stable/Godot_v4.2.2-stable_win64.exe.zip"
  },
  //(...)
]
```

## Where to find the generated files
The generated json files are hosted on github.io: https://drusin.github.io/gd-gh-dl-json-wrapper/json/main.json  
They are regenerated twice per day via Github actions.

## Running locally
Make sure you have Node 18 or later installed, then:
* clone or donwload the project
* `npm ci`
* `npm start`

This will regenerate the files in `docs/json`.