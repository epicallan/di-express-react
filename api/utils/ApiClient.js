import fetch from 'node-fetch';
import redis from 'redis';
import { REDIS_PORT, REDIS_ADDR } from '../config';


const client = process.env.NODE_ENV === 'test' ? null : redis.createClient(REDIS_PORT, REDIS_ADDR);

/**
* we are returning a promises
*/
export async function get(API, urlPart) {
  const url = `${API}/${urlPart}`;
  const res = await fetch(url);
  return res.json();
}

export function getFromRedis(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      // if (reply === null) reject(new Error('No data'))
      resolve(JSON.parse(reply) || reply);
      reject(err);
    });
  });
}

export function saveInRedis(key, data) {
  client.set(key, JSON.stringify(data), (err, res) => {
    if (err) console.error('error', err);
    console.log(res, `completed saving data on ${new Date()} for ${key}`);
  });
}

// kill redis connection incase application exits
process.on('exit', () => {
  if (client) client.quit();
});
