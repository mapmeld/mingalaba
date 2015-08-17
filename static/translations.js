// make translations with Polyglot.js
var polyglot, _;
var rightToLeft = false;
var translations = [];

function doTranslations() {
  polyglot = new Polyglot({ phrases: translations });
  _ = function (word, vars) {
    return polyglot.t(word, vars);
  };

  // translate words already on the page
  var translateWords = $(".translate");
  $.each(translateWords, function (w, word_element) {
    var word = $(word_element).text();
    $(word_element).text(_(word));

    var placeholder = $(word_element).attr('placeholder');
    if(placeholder) {
      $(word_element).attr('placeholder', _(placeholder));
    }

    var value = $(word_element).attr('value');
    if(value) {
      $(word_element).attr('value', _(value));
    }
  });

  // set page language (helps use spellcheck)
  $("html").attr("lang", _("en"));

  // check for right-to-left languages (including Arabic)
  // text inputs should have dir="auto" already set
  if (_("ltr") === "rtl") {
    rightToLeft = true;
    $("html").attr("dir", "rtl");
    $("body").addClass("rtl");
  }
}
