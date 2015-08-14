$(function() {
  // use an internal HTML5 canvas element to measure text
  var measure = $("<canvas>")[0].getContext("2d");

  function updateContent(highlighter) {
    var srcText = $("#source textarea").val().trim();
    srcText = srcText.replace(/(\S)/g, "<span/>$1");

    var joinedText;
    if (highlighter) {
      if (typeof highlighter == "function") {
        joinedText = highlighter(srcText);
      } else {
        var hl = new RegExp("(" + highlighter.replace(/(\S)/g, "<span/>$1") + ")", 'g');
        joinedText = srcText.replace(hl, '<highlight>$1</highlight>');
      }
    } else {
      joinedText = "<word>" + srcText.replace(/(\s+)/g, "</word>$1<word>") + "</word>";
    }
    $("#readout").html(joinedText);

    // double-clicking a word
    $("#readout word").dblclick(function(e) {
      updateContent($(this).text());
    });
  }

  $("#source textarea")
    .on("change keypress keyup", function() {
      // show split-up readout below
      updateContent();
    })
    .on("select", function(e) {
      // show what you are highlighting
      console.log(e);
      //updateContent("test");
    });
  updateContent();

  $("#font").change(function() {
    var newFont = $("#font").val();
    $("textarea, input, #readout").css({ fontFamily: newFont });
  });

  // run a regex to highlight text of chars
  $("#regex button").click(function() {
    var modInput = $("#regex input#exp").val();
    var rinput = new RegExp(modInput, $("#regex input#scope").val());
    updateContent(function(txt) {
      var replaces = txt.replace(/\<span\/\>/g, '').match(rinput);
      for (var i = 0; i < replaces.length; i++) {
        var separated = replaces[i].replace(/(\S)/g, "<span/>$1");
        var separatedEx = new RegExp("(" + separated + ")");
        txt = txt.replace(separatedEx, "<highlight>$1</highlight>");
      }
      return txt;
    });
  });
});
