# mingalaba

Mingalaba is an in-browser editor for manipulating multilingual strings and text.

## Features

When I am editing Unicode text in my source code, SQL, regular expressions, and in general, these are operations that I want to be able to do quickly:

- break a string down into its individual chars (နိုင် -> န ိ ု င ်) for better understanding and easier copy-paste
- compare strings to see where they stop matching
- see any invisible / missing code points
- look up any code point's meaning
- run SQL and regular expressions against sample data

Mingalaba is designed to make these actions smooth and visual, so you don't need language expertise to write the code.

See screenshots in the <a href="https://github.com/slang-group/mingalaba/tree/master/features">Features section</a>.

## Adding languages

Edit the translations.json file to add a language. If you don't know how
to edit the JSON file, put a list of translated words in the GitHub issues page.

Your computer doesn't have any fonts for some writing systems. If this is a problem for you, install a font on your machine, or request we include it as a web font.

## Technologies used

Client-side:

- jQuery
- PolyglotJS from Airbnb

Server-side:

- Node.JS
- static-server module

## License

GPLv3 deal with it
