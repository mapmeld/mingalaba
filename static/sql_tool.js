var db;
var customdb = false;
function setDB(Uints) {
  customdb = true;
  db = new SQL.Database(Uints);
  $("#source").hide()
  $("#chars").removeClass("col-lg-6").addClass("col-lg-12");
}

$(function() {
  function makeSqlQuery(query) {
    var actualQuery = function (query) {
      try {
        var result = db.exec(query)[0];
        if (result) {
          var header = [result.columns];
          var result_rows = result.values;
          updateReadout(header.concat(result_rows).map(function (row) {
            return JSON.stringify(row);
          }).join("<br/>"));
        } else {
          updateReadout('no results');
        }
      } catch (e) {
        console.log(e);
        updateReadout(e.toString().split("\n")[0]);
      }
      sql_in_progress = false;
    };

    if (customdb) {
      actualQuery(query);
    } else {
      var srcData = $("textarea").val().trim();

      var csv = Papa.parse(srcData, { delimiter: "," });
      var rows = csv.data;
      db = new SQL.Database();

      // eliminate old database info
      try {
        db.run('DROP TABLE rows');
      } catch (e) {}

      // create a new table
      var column_names = rows[0].concat([]);
      var inserts = column_names.map(function(column_name) {
        return "'" + column_name.replace(/'/g, '၊') + "' TEXT";
      });
      db.run("CREATE TABLE rows ('id' INTEGER PRIMARY KEY AUTOINCREMENT, " + inserts.join(',') + ')');

      // load CSV into table
      var loadRow = function(r) {
        var sqlvals = [];
        for (var key in rows[r]) {
          sqlvals.push(rows[r][key].replace(/'/g, '၊'))
        }
        db.run('INSERT INTO rows (' + column_names.join(',') + ") VALUES ('" + sqlvals.join("','") + "')");
        r++;
        if (r >= rows.length) {
          actualQuery(query);
        } else {
          loadRow(r);
        }
      };
      if (rows.length > 1) {
        loadRow(1);
      } else {
        updateReadout('');
        sql_in_progress = false;
      }
    }
  };

  var sqlm = CodeMirror.fromTextArea($("#sql textarea")[0], {
    mode: 'text/x-sql',
    viewportMargin: Infinity
  });

  var sql_in_progress = false;
  $("#sql button").click(function() {
    if (!sql_in_progress) {
      sql_in_progress = true;
      makeSqlQuery(sqlm.getValue());
    }
  });
});
