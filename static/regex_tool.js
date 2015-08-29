$(function() {
  function matchText(count) {
    if (count === 1) {
      return "(1 match)";
    } else {
      return "(" + count + " matches)";
    }
  }

  // run a regex to highlight text of chars
  $("#regex button").click(function() {
    var modInput = $("#regex input#exp").val();
    var rinput;
    try {
      rinput = new RegExp(modInput, $("#regex input#scope").val());
    } catch(e) {
      // user's regex was not valid
      $("#regex input").css({ background: "pink" });
      $("#regex #regex_complete").text("");
      updateContent();
      return;
    }
    // show valid input
    $("#regex input").css({ background: "#fff" });

    // show matches counter
    $("#regex #regex_complete").html(rinput.toString().replace(/(.)/g, "<span/>$1"));

    // show highlight on all matches, with custom function
    updateContent(function(txt) {
      var replaces = txt.match(rinput);
      $("#rmatches").text(matchText((replaces || []).length));
      if (replaces) {
        var oldReplaces = [];
        for (var i = 0; i < replaces.length; i++) {
          var separated = replaces[i];
          if (oldReplaces.indexOf(separated) === -1) {
            oldReplaces.push(separated);
            var separatedEx = new RegExp("(" + separated + ")", "g");
            txt = txt.replace(separatedEx, "<highlight>$1</highlight>");
          }
        }
      }
      return txt;
    });
  });
});
