# mingalaba

Mingalaba is an in-browser editor for manipulating multilingual strings and text.

When I am editing Unicode in my source code, SQL, regular expressions, and general text,
these are operations that I want to be able to do quickly:

- break a set of characters down into its individual pieces (နိုင် -> န ိ ု င ်) for easy copy-paste
- diff two strings to see where they don't match
- see any invisible / missing code points
- look up any code point's meaning
- run SQL and regular expressions against sample data

Mingalaba is designed to make these actions smooth and visual, so you don't need language expertise to write the code.

## Adding languages

Edit the translations.json file to add a language. If you don't know how
to edit the JSON file, put a list of translated words in the GitHub issues page.

Your computer doesn't have any fonts for some languages. If this is a problem for you, install a font on your machine, or request we include it as a web font.

## Technologies used

Client-side:

- jQuery
- PolyglotJS

Server-side:

- Node.JS
- static-server module

## License

GPLv3 deal with it
