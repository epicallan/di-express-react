import {get} from '../utils/externalApiClient';
import {DI_API} from '../config';

class UnbundlingAction {

  getOptionsData() {
    const promises = ['entity', 'sector', 'bundle', 'channel'].
                    map(id => get(DI_API, 'reference/' + id ));
    return Promise.all(promises);
  }

  async process0ptions() {
    const data = await this.getOptionsData();
    return data;
  }

  async getODAData(groupArgs, matchArgs) {
    const match = Object.assign({}, {'concept': 'oda'}, matchArgs);
    const group = groupArgs;
    const url = this.urlBuilder('oda', { match, group});
    const data = await get(DI_API, url);
    return data;
  }

  processODAData({match, group}) {
    return this.getODAData(group, match);
  }

  urlBuilder(endpoint, {match, group}) {
    let url = `aggregate/${endpoint}?`;
    url += '&match=' + JSON.stringify(match) || '';
    url += '&group=' + JSON.stringify(group) || '';
    return url;
  }
}

export const unbundlingAction = new UnbundlingAction();

export default async function unbundling(req) {
  console.log(req.body);
  return unbundlingAction.processODAData(req.body);
}
