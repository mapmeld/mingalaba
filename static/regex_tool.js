$(function() {
  // run a regex to highlight text of chars
  $("#regex button").click(function() {
    var modInput = $("#regex input#exp").val();
    var rinput;
    try {
      rinput = new RegExp(modInput, $("#regex input#scope").val());
      $("#regex input").css({ background: "#fff" });
    } catch(e) {
      $("#regex input").css({ background: "pink" });
      $("#regex #regex_complete").text("");
      updateContent();
      return;
    }
    $("#regex #regex_complete").html(rinput.toString().replace(/(\S)/g, "<span/>$1"));
    updateContent(function(txt) {
      var replaces = txt.replace(/\<span\/\>/g, '').match(rinput);
      $("#rmatches").text("(" + (replaces || []).length + " matches)");
      if (replaces) {
        for (var i = 0; i < replaces.length; i++) {
          var separated = replaces[i].replace(/(\S)/g, "<span/>$1");
          var separatedEx = new RegExp("(" + separated + ")");
          txt = txt.replace(separatedEx, "<highlight>$1</highlight>");
        }
      }
      return txt;
    });
  });
});
