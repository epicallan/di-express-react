import fetch from 'node-fetch';
import {DI_API_BASE} from '../config';

/**
* we are returning a promise
*/
export async function get(urlPart) {
  const url = `${DI_API_BASE}/${urlPart}`;
  const res = await fetch(url);
  return res.json();
}
