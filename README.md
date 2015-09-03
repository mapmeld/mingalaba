# mingalaba

Mingalaba is a desktop text editor for manipulating multilingual strings and text.

<img src="https://raw.githubusercontent.com/slang-group/mingalaba/master/features/screenshot.png" width="550"/>

## Features

When I am editing Unicode text in my source code, SQL, regular expressions, and in general, these are operations that I want to be able to do quickly:

- break a string down into its individual chars (နိုင် -> န ိ ု င ်) for better understanding and easier copy-paste
- compare strings to see where they stop matching
- see any invisible / missing code points
- look up any code point's meaning
- run SQL and regular expressions against sample data

Mingalaba is designed to make these actions smooth and visual, so you don't need language expertise to write the code.

See screenshots in the <a href="https://github.com/slang-group/mingalaba/tree/master/features">Features section</a>.

## Translating the UI

Edit the static/translations.json file to add a language. If you don't know how
to edit the JSON file, put a list of translated words in the GitHub issues page.

Your computer does not have fonts for some of the world's writing systems. If this is a problem for you, install a font on your machine, or request we include it as a web font.

## Technologies used

Client-side:

- jQuery
- sql.js from Alon Zakai
- Papa Parse from Matt Holt
- PolyglotJS from Airbnb

Desktop Client:

- Electron from GitHub

Server-side:

- Node.JS
- static-server module

## Running packager

Use electron-packager from Max Ogden

```bash
cd ..
npm install electron-packager -g
electron-packager ./mingalaba mingalaba --platform all --arch all --version 0.30.4
```

## Running server-side / in-browser

You can use index.html as a static page on GitHub Pages, or you can run a static server on your computer:

```
npm install
npm start
```

## License

GPLv3 deal with it
