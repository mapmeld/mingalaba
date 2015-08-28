var http = require('http');
var st = require('node-static');
var qs = require("querystring");

var sqlite3 = require("sqlite3");
var db = new sqlite3.Database('./source.sqlite3');

var file = new st.Server('./static/');

http.createServer(function (request, response) {
  var bodytxt = '';
  request.on('data', function (data) {
    bodytxt += data;
    if (bodytxt.length > 1e6) {
      request.connection.destroy();
    }
  });
  request.on('end', function () {
    if (request.url === "/sql") {
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
            console.log("INSERT INTO rows (" + column_names.join(",") + ") VALUES ('" + rows[r].join("','") + "')");
            db.run("INSERT INTO rows (" + column_names.join(",") + ") VALUES ('" + rows[r].join("','") + "')", function(err) {
              r++;
              if (r >= rows.length) {
                db.all(postdata.query, function(err, result_rows) {
                  if (err) {
                    console.log(err);
                  }
                  console.log(result_rows);
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
