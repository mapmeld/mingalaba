var http = require('http');
var st = require('node-static');
var qs = require('querystring');

var file = new st.Server('./static/');

var translations = require('./static/translations.json');

http.createServer(function (request, response) {
  var bodytxt = '';
  request.on('data', function (data) {
    bodytxt += data;
    if (bodytxt.length > 1e6) {
      request.connection.destroy();
    }
  });
  request.on('end', function () {
    var baseurl = request.url.toLowerCase().split('?')[0];
    if (baseurl === '/translate') {
      var default_language = 'en';

      // change default in this order: URL parameter is set, language in request header is available
      var set_language = null;
      if (request.url.indexOf('?') > -1) {
        set_language = qs.parse(request.url.split('?')[1]).lang || null;
      }
      if (!set_language) {
        var request_languages = request.headers['accept-language'].split(/,|;/);
        for (var lang = 0; lang < request_languages.length; lang++) {
          if (translations[request_languages[lang]]) {
            set_language = request_languages[lang];
            break;
          }
        }
        set_language = set_language || default_language;
      }
      response.write(JSON.stringify(translations[set_language] || {}));
      return response.end();
    } else {
      file.serve(request, response);
    }
  }).resume();
}).listen(8080);
