"use strict";

// Keep previews and local development out of the production advertising data.
(function initializeAnalytics() {
  if (!["www.baywaterfiji.com", "baywaterfiji.com"].includes(window.location.hostname)) return;
  if (window.HarvestAnalytics) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", "G-L75K1MQ8L3");
  const googleTag = document.createElement("script");
  googleTag.async = true;
  googleTag.src = "https://www.googletagmanager.com/gtag/js?id=G-L75K1MQ8L3";
  document.head.append(googleTag);

  // Meta's asynchronous base loader; initialize this site's pixel once.
  !function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";
    n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
  }(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", "2387761571964957");
  window.fbq("track", "PageView");

  window.HarvestAnalytics = {
    track(name, parameters = {}) {
      // A blocked or failed analytics provider must never break the store finder.
      try { window.gtag("event", name, parameters); } catch (_) { /* keep navigation working */ }
      try { window.fbq("trackCustom", name, parameters); } catch (_) { /* keep navigation working */ }
    }
  };
})();
