var updateContent;

$(function() {
  // use an internal HTML5 canvas element to measure text
  var measure = $("<canvas>")[0].getContext("2d");

  updateContent = function(highlighter) {
    var srcText = $("#source textarea").val().trim();
    srcText = srcText.replace(/(\S)/g, "<span/>$1");

    $("#rmatches").text("");

    var joinedText;
    if (highlighter) {
      if (typeof highlighter == "function") {
        joinedText = highlighter(srcText);
      } else {
        // diff tool: add words which differ from highlight term
        var words = $("#source textarea").val().trim().split(/\s|,|\.+/);
        var diff_words = [];
        var start_phrases = [];
        var end_phrases = [];
        for (var w = 0; w < words.length; w++) {
          var simHighlight = highlighter.toLowerCase();
          var simWord = words[w].toLowerCase();
          if (words[w] !== highlighter && diff_words.indexOf(simHighlight) === -1) {
            if (simWord[0] === simHighlight[0]) {
              start_phrases.push("");
              for (var c = 0; c < simWord.length && c < simHighlight.length; c++) {
                if (simWord[c] === simHighlight[c]) {
                  start_phrases[start_phrases.length-1] += simHighlight[c];
                } else {
                  break;
                }
              }
              diff_words.push(simWord);
            }
            if (simWord[simWord.length-1] === simHighlight[simHighlight.length-1]) {
              end_phrases.push("");
              for (var c = 1; c < simWord.length && c < simHighlight.length; c++) {
                if (simWord[simWord.length - c] === simHighlight[simHighlight.length - c]) {
                  end_phrases[end_phrases.length-1] = simHighlight[simHighlight.length - c] + end_phrases[end_phrases.length-1];
                } else {
                  break;
                }
              }
              diff_words.push(simWord);
            }
          }
        }

        // highlight tool: show words which do match
        var hl = new RegExp("(" + highlighter.replace(/(\S)/g, "<span/>$1") + ")", 'g');
        joinedText = srcText.replace(hl, '<highlight>$1</highlight>');

        for (var r = 0; r < start_phrases.length; r++) {
          if (start_phrases[r].length < 2) {
            continue;
          }
          var sq = new RegExp("(\\s|,|\\.+|^)(" + start_phrases[r].replace(/(\S)/g, "\<span\/\>$1") + ")", "gi");
          joinedText = joinedText.replace(sq, '$1<diff>$2</diff>');
        }

        for (r = 0; r < end_phrases.length; r++) {
          if (end_phrases[r].length < 2) {
            continue;
          }
          var sq = new RegExp("(" + end_phrases[r].replace(/(\S)/g, "\<span\/\>$1") + ")(\\s|,|\\.+|$)", "gi");
          joinedText = joinedText.replace(sq, '<diff>$1</diff>$2');
        }
      }

    } else {
      joinedText = "<word>" + srcText.replace(/(\s|,|\.+)/g, "</word>$1<word>") + "</word>";
    }
    $("#readout").html(joinedText.replace(/\r\n|\n/g, '<br/>'));

    // double-clicking a word
    $("#readout word").dblclick(function(e) {
      updateContent($(this).text());

      // todo: copy to clipboard without <span/>s

      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }

  // resetting highlight
  $("#readout").dblclick(function(e) {
    if (!$("#readout word").length) {
      updateContent();
    }
  });

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
  $("#font").change(function() {
    var newFont = $("#font").val();
    $("textarea, input, #readout").css({ fontFamily: newFont });
  });

  $("input").keypress(function(e) {
    if (e.keyCode === 13) {
      $(e.currentTarget).parent().find("button").click();
    }
  });

  updateContent();
});
