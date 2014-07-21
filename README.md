plugins
=======

Changes in 2.2.9
--------------

Browserify plugins can now cache generated files.
The file will be parsed and generated once, and then cached version will be returned for subsequent requests.
  
        "browserify": {
          "module": "mixdown-plugins#Browserify",
          "options": {
            "cache": true,
            "compress": false,
