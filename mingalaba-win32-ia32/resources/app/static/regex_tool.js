$(function() {
  function matchText(count) {
    if (count === 1) {
      return "(1 match)";
    } else {
      return "(" + count + " matches)";
    }
  }

  // update preview
  $("#regex input").on("change keypress keyup", function() {
    try {
      var rinput = new RegExp($("#regex input#exp").val(), $("#regex input#scope").val());
      $("#regex #regex_complete").html(rinput.toString().replace(/(.)/g, "<span/>$1"));
      $("#regex input").css({ background: "white" });
    } catch(e) {
      $("#regex #regex_complete").text("");
    }
  });

  // run a regex to highlight text of chars
  $("#regex button").click(function() {
    var rinput;
    try {
      rinput = new RegExp($("#regex input#exp").val(), $("#regex input#scope").val());
    } catch(e) {
      // user's regex was not valid
      $("#regex input").css({ background: "pink" });
      $("#regex #regex_complete").text("");
      updateContent();
      return;
    }
    // show valid input
    $("#regex input").css({ background: "#fff" });
    $("#regex #regex_complete").html(rinput.toString().replace(/(.)/g, "<span/>$1"));

    // show highlight on all matches, with custom function
    updateContent(function(txt) {
      txt = ' ' + txt + ' ';
      var replaces = txt.match(rinput);
      $("#rmatches").text(matchText((replaces || []).length));
      if (replaces) {
        replaces = replaces.sort(function (a, b) {
          return b.length - a.length;
        });
        console.log(replaces);
        for (var i = 0; i < replaces.length; i++) {
          var separated = replaces[i];
          var separatedEx = new RegExp("([^>])(" + separated.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ")([^<])");
          txt = txt.replace(separatedEx, "$1_<highlight>$2</highlight>_$3");
        }
      }
      return txt.trim().replace(/_<highlight>/g, '<highlight>').replace(/<\/highlight>_/g, '</highlight>');
    });
  });
});
