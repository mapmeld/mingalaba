$(function() {
  function makeSqlQuery(sql) {
    $.post("/sql", {
      query: sql,
      data: $("#source textarea").val()
    }, function(response) {
      console.log(response);
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
