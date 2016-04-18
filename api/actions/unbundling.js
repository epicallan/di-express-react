import {get} from '../utils/externalApiClient';
import {DI_API} from '../config';

class UnbundlingAction {

  async getOptionsData() {
    const promises = ['entity', 'sector', 'bundle', 'channel'].
                    map(id => get(DI_API, 'reference/' + id ));
    return Promise.all(promises);
  }

  process0ptionsData(data) {
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

  async getODAData({match, group}) {
    const url = this.urlBuilder('oda', { match, group});
    return get(DI_API, url);
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

export default async function unbundling(req) {
  const optionsRaw = await unbundlingAction.getOptionsData();
  const options = unbundlingAction.process0ptionsData(optionsRaw);
  const odaRaw = await unbundlingAction.getODAData(req.body);
  const activeLevel = unbundlingAction.getActiveLevelKey(req.body.group);
  const activeData = activeLevel ? options[activeLevel] : options['id-to'];
  const oda = unbundlingAction.processODAData(odaRaw, activeData);
  return {...options, oda};
}
