import {get, getFromRedis} from '../utils/ApiClient';
import { DI_API } from '../config';

class UnbundlingAction {

  async getOptionsData() {
    const data = await getFromRedis('options');
    return new Promise((resolve) => resolve(JSON.parse(data)));
  }

  async getODAData({match, group}) {
    if (group._id === '$id-to' && match['id-to'] === undefined) return this.getODAfromRedis();
    const url = this.urlBuilder('oda', { match, group});
    return get(DI_API, url);
  }

  async getODAfromRedis() {
    const odaRaw = await getFromRedis('unbundling-initial');
    return new Promise((resolve) => resolve(JSON.parse(odaRaw)));
  }

  getActiveLevelKey(group) {
    return group._id.split('$')[1];
  }

  processODAData(odaData, activeData) {
    // fuse options entity data with the oda data
    return odaData.data.map( obj => {
      const entity = activeData.find(data => data.id === obj._id);
      return Object.assign({}, obj, entity);
    });
  }

  urlBuilder(endpoint, {match, group}) {
    const matchArgs = Object.assign({}, {'concept': 'oda'}, match);
    let url = `aggregate/${endpoint}?`;
    url += '&match=' + JSON.stringify(matchArgs) || '';
    url += '&group=' + JSON.stringify(group) || '';
    return url;
  }
}

export const unbundlingAction = new UnbundlingAction();

export async function options() {
  const data = await unbundlingAction.getOptionsData();
  return data;
}

export async function oda(req) {
  const optionsData = await unbundlingAction.getOptionsData();
  const odaRaw = await unbundlingAction.getODAData(req.body);
  const activeLevel = unbundlingAction.getActiveLevelKey(req.body.group);
  const activeData = activeLevel ? optionsData[activeLevel] : optionsData['id-to'];
  const data = unbundlingAction.processODAData(odaRaw, activeData);
  return {oda: data};
}
