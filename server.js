var http = require('http');
var st = require('node-static');
var qs = require("querystring");

var sqlite3 = require("sqlite3");
var db = new sqlite3.Database('./source.sqlite3');

var file = new st.Server('./static/');

var translations = require("./translations.json");

http.createServer(function (request, response) {
  var bodytxt = '';
  request.on('data', function (data) {
    bodytxt += data;
    if (bodytxt.length > 1e6) {
      request.connection.destroy();
    }
  });
  request.on('end', function () {
    var baseurl = request.url.toLowerCase().split("?")[0];
    if (baseurl === "/translate") {
      var default_language = "en";

      // change default in this order: URL parameter is set, language in request header is available
      var set_language = null;
      if (request.url.indexOf("?") > -1) {
        set_language = qs.parse(request.url.split("?")[1]).lang || null;
      }
      if (!set_language) {
        var request_languages = request.headers["accept-language"].split(/,|;/);
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
    } else if (baseurl === "/sql") {
      db.run("DROP TABLE rows", function(err) {
        // create a new table
        var postdata = qs.parse(bodytxt);
        var rows = postdata.data.split(/\r\n|\n/);
        for (var r = 0; r < rows.length; r++) {
          rows[r] = rows[r].split(",");
        }
        var column_names = rows[0];
        var inserts = rows[0].concat().map(function(column_name) {
          return "'" + column_name + "' TEXT";
        });

        db.run("CREATE TABLE rows ('id' INTEGER PRIMARY KEY AUTOINCREMENT, " + inserts.join(",") + ")", function(err) {
          var loadRow = function(r) {
            db.run("INSERT INTO rows (" + column_names.join(",") + ") VALUES ('" + rows[r].join("','") + "')", function(err) {
              r++;
              if (r >= rows.length) {
                db.all(postdata.query, function(err, result_rows) {
                  if (err) {
                    console.log(err);
                  }
                  response.write(JSON.stringify(result_rows) + "");
                  response.end();
                });
              } else {
                loadRow(r);
              }
            });
          };
          loadRow(1);
        });
      });
    } else {
      file.serve(request, response);
    }
  }).resume();
}).listen(8080);
