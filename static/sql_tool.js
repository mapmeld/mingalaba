$(function() {
  // need to send this to the server for true SQLite

  function makeSqlQuery(sql) {
    /*
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
        if (mode === "WHERE") {
          if (['LITERAL', 'OPERATOR', 'NUMBER', 'STRING'].indexOf(query[p][0]) > -1) {
            criteria.push(query[p][1]);
          }
        }
      }
    }

    // srcData = srcData.split(/\r\n|\n/g);
    var columns = rows[0];
    var outrows = [];
    var outcolumns = [];

    var rejectRow = function(row) {
      var evalPhrase = '';
      for (var c = 0; c < criteria.length; c++) {
        if (columns.indexOf(criteria[c]) > -1) {
          var rowVal = row[columns.indexOf(criteria[c])];
          if (isNaN(rowVal * 1)) {
            evalPhrase += "'" + rowVal.replace(/'/g, "\\'") + "'";
          } else {
            evalPhrase += rowVal * 1;
          }
        } else {
          evalPhrase += criteria[c];
          if (criteria[c] === "=") {
            evalPhrase += "=";
          }
        }
      }
      try {
        return !(eval(evalPhrase));
      } catch(e) {
        console.log(e);
        return true;
      }
    };

    for (var r = 1; r < rows.length; r++) {
      var outrow = rows[r].concat([]);
      if (rejectRow(outrow)) {
        continue;
      }
      if (selections.indexOf("*") > -1) {
        if (!outcolumns.length) {
          outcolumns = columns.concat([]);
        }
        for (var or = 0; or < outrow.length; or++) {
          outrow[or] = outrow[or].split("").join("<span/>");
        }
      } else {
        outrow = [];
        for (var s = 0; s < selections.length; s++) {
          if (columns.indexOf(selections[s]) > -1) {
            if (outrows.length === 0) {
              outcolumns.push(selections[s]);
            }
            outrow.push( rows[r][ columns.indexOf(selections[s]) ].split("").join("<span/>") );
          }
        }
      }
      outrows.push(outrow.join(","));
    }
    outrows = outrows.join("<br/>");

    $("#readout").html(outcolumns.join(",") + "<br/>" + outrows);

    sql_in_progress = false;
*/

    $.post("/sql", {
      query: sql,
      data: $("#source textarea").val().trim()
    }, function(response) {
      var j_response = JSON.parse(response);
      $("#readout").html(j_response.map(function(response_row) {
        return JSON.stringify(response_row).split("").join("<span/>");
      }).join("<br/>"))
      sql_in_progress = false;
    });
  }

  var sql_in_progress = false;
  $("#sql button").click(function() {
    if (!sql_in_progress) {
      sql_in_progress = true;
      makeSqlQuery($("#sql input").val());
    }
  });
});
