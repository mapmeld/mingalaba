$(function() {
  function makeSqlQuery(query) {
    var srcData = $("textarea").val().trim();

    // until server-side SQL is configured, do a CSV Parse
    var csv = Papa.parse(srcData, { delimiter: "," });
    var rows = csv.data;

    var db = new SQL.Database();

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
        var result = db.exec(query)[0];
        var header = [result.columns];
        var result_rows = result.values;
        updateReadout(header.concat(result_rows).map(function (row) {
          return JSON.stringify(row);
        }).join("<br/>"));
        sql_in_progress = false;
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
  };

  var sql_in_progress = false;
  $("#sql button").click(function() {
    if (!sql_in_progress) {
      sql_in_progress = true;
      makeSqlQuery($("#sql input").val());
    }
  });
});
