async function openCacheStorage() {
  return await window.caches.open('locationData');
}

function createRequest(url, method, body = '') {
  let requestInit = {
    method: method,
  };

  if (body != '') {
    requestInit.body = body;
  }

  let request = new Request(url, requestInit);

  return request;
}
export async function store(url, method, body = '', responseString) {
  let blazorSchoolCache = await openCacheStorage();
  let request = createRequest(url, method, body);
  let response = new Response(responseString);
  await blazorSchoolCache.put(request, response);
}

export async function get(url, method, body = '') {
  let blazorSchoolCache = await openCacheStorage();
  let request = createRequest(url, method, body);
  let response = await blazorSchoolCache.match(request);
  if (response == undefined) {
    return '';
  }
  //return 'hello';
  return await response.text();
  let temp = await response.json();
  return temp;
  let result = await response.text();

  return result;
}

export async function remove(url, method, body = '') {
  let blazorSchoolCache = await openCacheStorage();
  let request = createRequest(url, method, body);
  await blazorSchoolCache.delete(request);
}

export async function removeAll() {
  let blazorSchoolCache = await openCacheStorage();
  let requests = await blazorSchoolCache.keys();

  for (let i = 0; i < requests.length; i++) {
    await blazorSchoolCache.delete(requests[i]);
  }
}
