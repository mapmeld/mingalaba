var http = require('http');
var st = require('node-static');
var qs = require('querystring');
var csv = require('fast-csv');

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./source.sqlite3');

var file = new st.Server('./static/');

var translations = require('./translations.json');

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
    } else if (baseurl === '/sql') {
      db.run('DROP TABLE rows', function(err) {
        // create a new table
        var postdata = qs.parse(bodytxt);
        var csvsrc = postdata.data;
        var rows = [];

        csv.fromString(csvsrc, { headers: true })
          .on('data', function (data) {
            rows.push(data);
          })
          .on('end', function () {
            var column_names = Object.keys(rows[0]);
            var inserts = column_names.map(function(column_name) {
              return "'" + column_name.replace(/'/g, '၊') + "' TEXT";
            });

            db.run("CREATE TABLE rows ('id' INTEGER PRIMARY KEY AUTOINCREMENT, " + inserts.join(',') + ')', function(err) {
              var loadRow = function(r) {
                var sqlvals = [];
                for (var key in rows[r]) {
                  sqlvals.push(rows[r][key].replace(/'/g, '၊'))
                }
                db.run('INSERT INTO rows (' + column_names.join(',') + ") VALUES ('" + sqlvals.join("','") + "')", function(err) {
                  r++;
                  if (r >= rows.length) {
                    db.all(postdata.query, function(err, result_rows) {
                      response.write(JSON.stringify(err || result_rows) + '');
                      response.end();
                    });
                  } else {
                    loadRow(r);
                  }
                });
              };
              if (rows.length) {
                loadRow(0);
              } else {
                response.write('[]');
                response.end();
              }
            });
          });
      });
    } else {
      file.serve(request, response);
    }
  }).resume();
}).listen(8080);
