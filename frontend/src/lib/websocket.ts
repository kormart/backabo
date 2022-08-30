// Use 8787 for local development
const host = globalThis.location?.host.replace(/:\d+/, ':8787');
const protocol = globalThis.location?.protocol || 'http:';
const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';

export const createWebhookURL = async () => {
  console.log(protocol + '//' + host + '/new_webhook');
  const res = await fetch(protocol + '//' + host + '/new_webhook');
  return await res.json();
};

export const createWebsocket = (id: string, token: string, url: string) => {
  const wsURL = wsProtocol + '//' + host // + '/ws/' + id + '/' + token;
  const ws = new WebSocket(wsURL);
  if (!ws) {
    throw new Error("Server didn't accept WebSocket");
  }
  return { ws, id, token, url };
};

export const init = async (id?: string, token?: string, url?: string) => {
  console.log("*** log, init: globalThis.window", globalThis.window);
  if (!globalThis.window) {
    return;
  }

  if (!id || !token || !url) {
//    let { id, token, url } = await createWebhookURL();
    let { id, token, url } = {id: '', token: '', url: ''};
    return createWebsocket(id, token, url);
  }

  return createWebsocket(id, token, url);
};
