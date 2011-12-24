document.addEventListener("DOMContentLoaded", function() {
  var a = document.querySelector("a");
  a.href = "javascript:(function(){window.__harvest_path='" + window.location.protocol + "//" + window.location.host + "/';var s=document.createElement('script');s.type='text/javascript';s.src='" + window.location.protocol + "//" + window.location.host + "/initializer.js';document.getElementsByTagName('head')[0].appendChild(s);})();";
}, false);
