import {get, saveInRedis} from '../utils/ApiClient';
import { DI_API } from '../config';

async function getOptionsData() {
  const promises = ['entity', 'sector', 'bundle', 'channel'].
                  map(id => get(DI_API, 'reference/' + id ));
  return Promise.all(promises);
}

function process0ptionsData(data) {
  const options = {
    sector: data[1],
    bundle: data[2],
    channel: data[3]
  };
  options['id-to'] = data[0].filter( obj => {
    return obj['donor-recipient-type'] === 'recipient'
    || obj['donor-recipient-type'] === 'crossover'
    || obj['donor-recipient-type'] === 'region';
  });
  options['id-from'] = data[0].filter(obj => {
    return obj['donor-recipient-type'] === 'donor'
    || obj['donor-recipient-type'] === 'multilateral';
  });
  return options;
}
/**
 * saveOptionsData saves all the various options data
 * this is the data used in coming up with the unbundling aid dropdowns/options
 * its also used in formulating requests for data
 * @return {obj}
 */
async function saveOptionsData() {
  const data = await getOptionsData();
  const options = process0ptionsData(data);
  return saveInRedis('options', options);
}
/**
 * saveAidToData:  saves all the id-to (Aid to) country data
 * This is the data that is used in drawing up the initial unbundling aid treemap
 * @return {obj}
 */
function getInitalAidData() {
  const match = {
    'concept': 'oda',
    'year': 2013
  };
  const group = {
    '_id': '$id-to',
    'total': {'$sum': '$value'}
  };
  let url = `aggregate/oda?`;
  url += '&match=' + JSON.stringify(match);
  url += '&group=' + JSON.stringify(group);
  return get(DI_API, url);
}

async function saveInitialAidData() {
  const data = await getInitalAidData();
  return saveInRedis('unbundling-initial', data);
}
/**
 * sychronised the redis jobs so that i can close the client when they are done
 */
export default () => {
  console.log('starting cron jobs');
  saveInitialAidData();
  saveOptionsData();
};
