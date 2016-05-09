import {get, getFromRedis} from '../utils/ApiClient';
import { DI_API } from '../config';

class UnbundlingAction {

  async getOptionsData() {
    const data = await getFromRedis('options');
    return new Promise((resolve) => resolve(data));
  }

  async getODAData({match, group}) {
    if (!Number.isNaN(match.year)) match.year = parseInt(match.year, 10); // making sure year is an integer
    // needs refactoring getODAfromRedis should take in an argument
    if (match.year === 2013 && Object.keys(match).length < 2) return this.getODAfromRedis();
    const url = this.urlBuilder('oda', { match, group});
    return get(DI_API, url);
  }

  async getODAfromRedis() {
    const odaRaw = await getFromRedis('unbundling-initial');
    return new Promise((resolve) => resolve(odaRaw));
  }
  /**
   * getActiveLevelKey returns active metric eg aid to or aid from
   * This allows us to find out which data to enrich the raw odaData with.
   * @param  {[object]} got from request
   * @return {string}   id-to or id-from
   */
  getActiveLevelKey(group) {
    return group._id.split('$')[1];
  }

  processODAData(odaData, activeData) {
    // fuse options entity data with the oda data
    return odaData.data.map( obj => {
      const entity = activeData.find(data => data.id === obj._id);
      obj.value = obj.total;
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


export default async function unbundling(req, params) {
  if (params[0] === 'options') return await unbundlingAction.getOptionsData();
  const optionsData = await unbundlingAction.getOptionsData();
  const odaRaw = await unbundlingAction.getODAData(req.body);
  // let us find out whether we are look at data for countries that recieve aid or give AID
  const activeLevel = unbundlingAction.getActiveLevelKey(req.body.group);
  // let us enrich the various data rows/fields with their corresponding rich data
  const richLevelData = activeLevel ? optionsData[activeLevel] : optionsData['id-to'];
  // let us compose the data
  const data = unbundlingAction.processODAData(odaRaw, richLevelData);
  return {name: 'oda', children: data};
}
