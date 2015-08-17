$(function() {
  // completely pseudocode so far
  // need to send this to the server for true SQLite
  // possible to use Web SQL? is that still a thing?

  function makeSqlQuery(sql) {
    var srcData = $("textarea").val().trim();

    // until server-side SQL is configured, do a CSV Parse
    var csv = Papa.parse(srcData, { delimiter: "," });
    var rows = csv.data;

    // then parse the query
    var query = SQLParser.lexer.tokenize(sql);
    var selections = [];
    var criteria = [];
    var mode;
    for (var p = 0; p < query.length; p++) {
      if (query[p][0] === "SELECT") {
        mode = "SELECT";
      } else if (query[p][0] === "FROM") {
        mode = "FROM";
      } else if (query[p][0] === "WHERE") {
        mode = "WHERE";
      } else if (mode) {
        // must be part of the current mode
        if (mode === "SELECT") {
          if (query[p][0] === "LITERAL" || query[p][0] === "STAR") {
            selections.push(query[p][1]);
          }
        }
      }
    }

    // srcData = srcData.split(/\r\n|\n/g);
    var columns = rows[0];
    var outrows = [];
    var outcolumns = [];
    for (var r = 1; r < rows.length; r++) {
      var outrow = [];
      if (selections.indexOf("*") > -1) {
        if (!outcolumns.length) {
          outcolumns = columns.concat([]);
        }
        outrow = rows[r].concat([]);
      } else {
        for (var s = 0; s < selections.length; s++) {
          if (columns.indexOf(selections[s]) > -1) {
            if (r === 1) {
              outcolumns.push(selections[s]);
            }
            outrow.push( rows[r][ columns.indexOf(selections[s]) ] );
          }
        }
      }
      outrows.push(outrow.join(","));
    }
    outrows = outrows.join("<br/>");

    $("#readout").html(outcolumns.join(",") + "<br/>" + outrows);

    sql_in_progress = false;

    /*
    $.post("/sql", {
      query: sql,
      data: $("#source textarea").val()
    }, function(response) {
      console.log(response);
    });
    */
  }

  var sql_in_progress = false;
  $("#sql button").click(function() {
    if (!sql_in_progress) {
      sql_in_progress = true;
      makeSqlQuery($("#sql input").val());
    }
  });
});
