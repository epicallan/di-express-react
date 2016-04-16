import fetch from 'node-fetch';

/**
* we are returning a promise
*/
export async function get(API, urlPart) {
  const url = `${API}/${urlPart}`;
  // console.log(url);
  const res = await fetch(url);
  return res.json();
}
