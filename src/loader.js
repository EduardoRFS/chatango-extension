(function () {
  stopAndClear();

  const EXT_PATH = chrome.extension.getURL('/');
  const MODS_PATH = chrome.extension.getURL('/') + 'mods/';
  let BASE_PATH = EXT_PATH + 'chattanga/';

  if (isGroup())
    loadGroup();
  else
    loadPM();

  function loadPM () {
    return loadBase()
      .then(_ => loadScript(BASE_PATH + 'PmModule.js'))
      .then(_ => loadMods('pm.json'));
  }
  function loadGroup () {
    return loadBase()
      .then(_ => loadScript(BASE_PATH + 'Group.js'))
      .then(_ => loadMods('group.json'));
  }
  function loadBase () {
    return getJSON(BASE_PATH + 'cfg/nc/r.json')
      .then(json => BASE_PATH += `/js/gz/r${json.r}/`)
      .then(loadExtPath)
      .then(_ => loadScript(BASE_PATH + 'shell.js'))
      .then(_ => loadScript(BASE_PATH + 'CommonCoreModule.js'))
  }
  function loadMods (src) {
    return getJSON(MODS_PATH + src)
      .then(arr => {
        let idx = -1;

        return next();
        function next () {
          idx++;
          if (!arr[idx]) return;
          return loadScript(MODS_PATH + arr[idx]).then(next);
        }
      });
  }
  function getJSON (src) {
    return fetch(src)
      .then(res => res.json());
  }
  function loadScript (src) {
    const script = document.createElement('script');
    script.src = src;
    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  function stopAndClear () {
    window.stop();
    document.children[0].innerHTML = `
      <head></head>
      <body>
      </body>
    `;
    document.body.style.display = 'block';
  }
  function loadExtPath () {
    const script = document.createElement('script');
    script.innerHTML = 'EXT_PATH = "' + EXT_PATH + '"';
    document.head.appendChild(script);
  }
  function isGroup () {
    return window.location.hash
      .slice(1)
      .split('-')
      .slice(-1)[0] === 'group';
  }
})();
