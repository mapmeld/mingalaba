var http = require('http');
var st = require('node-static');
//var sqlite3 = require("sqlite3");
//var db = new sqlite3.Database('./source.sqlite3');

var file = new st.Server('./static/');

http.createServer(function (request, response) {
  request.addListener('end', function () {
    if (request.url === "/sql") {
      /*
      db.run("DELETE FROM rows", function(err) {
        db.run("INSERT INTO ROWS (a, b) VALUES (1, 2)", function(err) {
          db.all(request.body.sql, function(err, rows) {
            response.write(rows);
            response.end();
          });
        });
      });
      */
    } else {
      file.serve(request, response);
    }
  }).resume();
}).listen(8080);
