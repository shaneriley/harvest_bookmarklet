function Bookmarklet() {
  var $ = j$;
  var controls = {
    "<mark>X</mark>d": "Deletes line number <mark>X</mark>",
    "<mark>X</mark>e": "Edits line number <mark>X</mark>",
    h: "Toggles this help window",
    n: "Create new entry",
    "esc": "Cancels current action",
    "<span class='cmd'>Cmd</span>-enter": "Saves currently active entry"
  };

  var b = {
    p: "harvest_bookmarklet_",
    $el: $(),
    $help: $(),
    $modal: $(),
    $modal_layer: $(),
    actions: {},
    buffer: "",
    prepBookmarkletContainer: function() {
      b.$el = $("<div />", { id: b.p.replace(/_$/, "") }).appendTo(document.body);
    },
    prepHelpIcon: function() {
      b.$help = $("<a />", {
        id: b.p + "help",
        href: "#",
        text: "Help",
        click: b.openModal
      }).appendTo(b.$el);
    },
    prepModal: function() {
      var $dl = $("<dl />");
      b.$modal = $("<div />", { id: b.p + "modal" }).appendTo(document.body);
      b.$modal_layer = $("<div />", {
        id: b.p + "modal_layer",
        click: b.closeModal
      }).appendTo(document.body);
      $("<h1 />", { text: "Shortcut Keys" }).appendTo(b.$modal);
      $("<a />", {
        "class": "close",
        href: "#",
        text: "Close",
        click: b.closeModal
      }).appendTo(b.$modal);
      $("<p />", { text: "All line numbers are 1-based" }).appendTo(b.$modal);
      $dl.appendTo(b.$modal);
      for (var v in controls) {
        $("<dt />", { html: v }).appendTo($dl);
        $("<dd />", { html: controls[v] }).appendTo($dl);
      }
      b.openModal();
    },
    prepActions: function() {
      var a = b.actions;
      a.$new = $("a#add_day_entry_link");
      a.$entries = $("table#summary tr").not("#day_entry_row_DAY_ENTRY_ID");
      a.refresh = function() {
        b.prepActions();
        return a.$entries;
      };
    },
    openModal: function() {
      b.$modal.add(b.$modal_layer).fadeIn(500);
      return false;
    },
    closeModal: function() {
      b.$modal.add(b.$modal_layer).fadeOut(500);
      return false;
    },
    keypress: function(e) {
      var $e = $(e.target);
      var actions = {
        "13": function() {
          // cmd-enter
          $e.blur().closest("tr").find(".btn-submit.btn-primary").click();
          b.buffer = "";
          e.preventDefault();
        },
        "27": function() {
          // esc
          var $txt;
          if (b.$modal.is(":visible")) {
            b.closeModal();
          }
          else {
            $txt = $e.closest("tr").find("textarea");
            $e.blur().closest("tr").find("a.btn-submit:contains(Cancel)").click();
            $txt.val($txt.data("prev_value"));
          }
          b.buffer = "";
        },
        "68": function() {
          // delete (d)
          var e = document.createEvent("HTMLEvents"),
              idx = +b.buffer - 1;
          if (idx < 0) { idx = 0; }
          e.initEvent("click", true, true);
          b.actions.$entries.eq(idx).find("a.delete").click();
          b.actions.refresh().find("a.prompt.yes")[0].dispatchEvent(e);
          b.buffer = "";
        },
        "69": function() {
          // edit (e)
          var idx = +b.buffer - 1,
              $txt;
          if (idx < 0) { idx = 0; }
          $txt = b.actions.$entries.eq(idx).find("a.edit").click()
            .closest("td").find("textarea").focus();
          $txt.data("prev_value", $txt.val());
          b.buffer = "";
          e.preventDefault();
        },
        "72": function() {
          // help (h)
          b[(b.$modal.is(":hidden") ? "open" : "close") + "Modal"]();
          b.buffer = "";
        },
        "78": function() {
          // new (n)
          b.actions.$new.click();
          b.buffer = "";
        },
        "88": function() { b.$modal.is(":visible") && b.closeModal(); },
        default: function() {
          var s = String.fromCharCode(e.keyCode);
          if (!isNaN(+s)) { b.buffer += s; }
        }
      };
      if ($e.is(":input")) {
        if ((e.keyCode !== 27 && e.keyCode !== 13) || (e.keyCode === 13 && !e.metaKey)) {
          return;
        }
      }
      b.actions.refresh();
      actions[e.keyCode in actions ? e.keyCode : "default"]();
    },
    init: function() {
      for (var v in b) {
        if (/^prep/.test(v) && typeof b[v] === "function") {
          b[v]();
        }
      }
      $(document).bind("keydown.harvest_bookmarklet", b.keypress);
    }
  };

  var initAll = function() {
    if (!$) {
      setTimeout(initAll, 20);
      return false;
    }
    $(b.init);
  };
  initAll();
}
