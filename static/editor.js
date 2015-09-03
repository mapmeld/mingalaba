var updateContent, updateReadout;

$(function() {
  updateReadout = function (chars) {
    var measure_canvas = $("<canvas>")[0];
    var measure = measure_canvas.getContext('2d');
    chars = chars.replace(/\r\n/g, '\\r\\n<br/>').replace(/\n/g, '\\n<br/>').split("");
    for (var c = 0; c < chars.length; c++) {
      // don't split ASCII, so you can embed ASCII tags
      // split the rest so diacritics are visible
      if (chars[c].charCodeAt(0) > 127) {
        if (measure.measureText(chars[c]).width === 0) {
          chars[c] = "<null>" + chars[c] + "</null>";
        }
        chars[c] = "<span/>" + chars[c];
      }
    }
    $("#readout").html(chars.join(""));
  };

  updateContent = function(highlighter) {
    var srcText = $("#source textarea").val().trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');

    $("#rmatches").text("");

    var joinedText;
    if (highlighter) {
      if (typeof highlighter == "function") {
        // tool sent a custom highlighter function
        joinedText = highlighter(srcText);
      } else {
        // diff tool: show where words differ from highlight term
        // include if they start, end, or are different case from highlight
        var words = $("#source textarea").val().trim().split(/\s|,|\"|\'|\?|\!|\r|\n|\.+/);
        var diff_words = [];
        var start_phrases = [];
        var end_phrases = [];
        for (var w = 0; w < words.length; w++) {
          var simHighlight = highlighter.toLowerCase();
          var simWord = words[w].toLowerCase();
          if (words[w] !== highlighter && diff_words.indexOf(simHighlight) === -1) {
            if (simWord[0] === simHighlight[0]) {
              var highlightPart = '';
              for (var c = 0; c < simWord.length && c < simHighlight.length; c++) {
                if (simWord[c] === simHighlight[c]) {
                  highlightPart += simHighlight[c];
                } else {
                  break;
                }
              }
              diff_words.push(simWord);
              if (highlightPart.length > 1 && start_phrases.indexOf(highlightPart) === -1) {
                start_phrases.push(highlightPart);
              }
            }
            if (simWord[simWord.length-1] === simHighlight[simHighlight.length-1]) {
              var highlightPart = '';
              for (var c = 1; c <= simWord.length && c <= simHighlight.length; c++) {
                if (simWord[simWord.length - c] === simHighlight[simHighlight.length - c]) {
                  highlightPart = simHighlight[simHighlight.length - c] + highlightPart;
                } else {
                  break;
                }
              }
              diff_words.push(simWord);
              if (highlightPart.length > 1 && end_phrases.indexOf(highlightPart) === -1) {
                end_phrases.push(highlightPart);
              }
            }
            start_phrases.sort(function(a, b) {
              return b.length - a.length;
            });
            end_phrases.sort(function(a, b) {
              return b.length - a.length;
            });
          }
        }

        // highlight tool: show words which do match
        var hl = new RegExp("(" + highlighter + ")", 'g');
        joinedText = srcText.replace(hl, '<highlight>$1</highlight>');

        // after the 100% matches are highlighted, apply diffs
        for (var r = 0; r < start_phrases.length; r++) {
          if (start_phrases[r].length < 2) {
            continue;
          }
          var sq = new RegExp("(\\s|,|\\.+|^)(" + start_phrases[r] + ")", "gi");
          joinedText = joinedText.replace(sq, '$1<diff>$2</diff>');
        }

        for (r = 0; r < end_phrases.length; r++) {
          if (end_phrases[r].length < 2) {
            continue;
          }
          var sq = new RegExp("(" + end_phrases[r] + ")(\\s|,|\\.|\"|\'|\\?|\\!|\\r|\\n+|$)", "gi");
          joinedText = joinedText.replace(sq, '<diff>$1</diff>$2');
        }
      }
    } else {
      // by default, split text into "words" with spaces and other breaking characters
      // TODO: unicode-categories
      joinedText = "<word>" + srcText.replace(/(\s|,|\.+)/g, "</word>$1<word>") + "</word>";
    }
    updateReadout(joinedText);

    // double-clicking a word highlights all of its appearances
    // and highlights words which start or end the same, too
    $("#readout word").dblclick(function(e) {
      updateContent($(this).text());

      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  };

  // set and reset highlight on doubleclick
  $("#readout").dblclick(function(e) {
    if (!$("#readout word").length) {
      updateContent();
    }
  });

  $("#source textarea")
    .on("keypress", function (e) {
      if (e.keyCode === 8) {
        // backspace removes one char at a time
        e.preventDefault();
        var content = $("#source textarea").val();
        $("#source textarea").val( content.substring(0, content.length - 1) );
        return false;
      }
    })
    .on("change keypress keyup", function() {
      $("#source textarea").css({
        height: $("#source textarea")[0].scrollHeight + "px"
      });

      // show split-up readout below text input
      updateContent();
    })
    .on("select", function(e) {
      // show what you are highlighting
      var selection = this.value.substring(this.selectionStart, this.selectionEnd);
      updateContent(selection);
      if (selection.length && selection.length < 4) {
        $("#chars .lookup").html('').show();
        for (var s = 0; s < selection.length; s++) {
          $("#chars .lookup").append(
            $("<a></a>")
              .text(selection[s])
              .attr("href", "http://unicode.org/charcode/" + selection.charCodeAt(s))
          );
        }
      } else {
        $("#chars .lookup").hide();
      }
    })
    .on("blur", function() {
      setTimeout(function() {
        $("#chars .lookup").hide();
      }, 400);
    });

  // fonts to support different languages
  // keep consistent across input and output fields
  $("#font").change(function() {
    var newFont = $("#font").val();
    $("textarea, input, #readout, .CodeMirror").css({ fontFamily: newFont });
  });

  // syntax highlighting
  var cm = null;
  $("#syntax").change(function() {
    if (cm) {
      cm.setOption('mode', $("#syntax").val());
    } else {
      debugger;
      cm = CodeMirror.fromTextArea($("#source textarea")[0], {
        mode: $("#syntax").val()
      });
    }
  });

  // pressing enter/return should activate a tool
  $("input").keypress(function(e) {
    if (e.keyCode === 13) {
      $(e.currentTarget).parent().find("button").click();
    }
  });

  // uploading a file
  $("input[type='file']").change(function() {
    if (this.files.length) {
      var file = this.files[0];
      var reader = new FileReader();
      if (file.name && file.name.toLowerCase().indexOf(".sql") > -1) {
        // implement with SQL tool
        reader.onload = function() {
          var Uints = new Uint8Array(reader.result);
          setDB(Uints);
        };
        reader.readAsArrayBuffer(file);
      } else {
        reader.onload = function(e) {
          $("textarea").val(e.target.result);
          updateContent();
        };
        reader.readAsText(file);
      }
    }
  });

  updateContent();
});
