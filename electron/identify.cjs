const IDENTIFIED_URLS = ['https://tile.openstreetmap.org/*', 'https://photon.komoot.io/*'];

const appUserAgent = (version) => `DatePlanter/${version} (personal date planner; Electron)`;

function identifyApp(session, version) {
  const userAgent = appUserAgent(version);
  session.webRequest.onBeforeSendHeaders({ urls: IDENTIFIED_URLS }, (details, callback) => {
    callback({ requestHeaders: { ...details.requestHeaders, 'User-Agent': userAgent } });
  });
}

module.exports = { IDENTIFIED_URLS, appUserAgent, identifyApp };
