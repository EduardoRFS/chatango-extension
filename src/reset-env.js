(function () {
  stopAndClear();

  const handler = getHandler();
  loadGroup();

  function getHandler () {
    const reg = /(www.|)(.*).chatango.com?/i;
    return reg.exec(window.location.host)[2];
  }
  function createIFrame (isGroup) {
    const hash = `${handler}-${!isGroup || 'group'}`;
    const ifr = document.createElement('iframe');
    ifr.src = '//st.chatango.com/styles/grp.css#' + hash;
    document.body.appendChild(ifr);
    window
      .addEventListener("message", isGroup ? bootstrapGroup : bootstrapPM);
  }
  function stopAndClear () {
    window.stop();
    document.children[0].innerHTML = `
      <head></head>
      <body>
        <title>Chatango</title>
      </body>
    `;
    document.body.style.display = 'block';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
  }
  function loadGroup () {
    let isGroup;
    const reg = /<title>(.*)<\/title>/i;
    const url = `http://ust.chatango.com/groupinfo/${handler[0]}/${handler[1]}/${handler}/gprofile.xml`;
    return fetch(url)
      .then(parseResponse)
      .then(parseText)
      .then(createIFrame);

    function parseResponse (resp) {
      isGroup = resp.status === 200;
      return resp.text();
    }
    function parseText (text) {
      const m = reg.exec(text);
      const title = document.body.querySelector('title');
      title.innerHTML = isGroup ? m[1] : 'Chat!';
      return isGroup;
    }
  }
  function waitCid () {
    return new Promise(resolve => {

    });
  }

  function bootstrapPM () {
    const iframe = document.querySelector('iframe');
    const handler = getHandler();
    getTok().then(tok => iframe.contentWindow.postMessage(JSON.stringify({
      chatango_cmd: "cid",
      payload: {
        height: "100%",
        width: "100%",
        handle: handler,
        styles: {
          pm:1,
          s: tok,
          sellerid: handler
        }
      }
    }), '*'));
    function getTok () {
      const xhr = new XMLHttpRequest;
      xhr.open('POST', '//' + handler + '.chatango.com/tok');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send('aaaa=true');
      return new Promise(resolve => {
        xhr.onload = () => {
          resolve(xhr.responseText.slice(2));
        }
      });
    }
  }
  function bootstrapGroup () {
    const handler = getHandler();
    const iframe = document.querySelector('iframe');
    iframe.contentWindow.postMessage(JSON.stringify({
      chatango_cmd: "cid",
      payload: {
        fid: "337110123456790",
        cid: "cid0123456790_",
        height: "100%",
        width: "100%",
        handle: handler,
        styles: {
          r: 100,
          v: 0,
          t: 0,
          w: 0,
          surl: 1,
          fwtickm: 0,
          ac: 1
        },
        window: {}
      }
    }), "*");

  }
})();
