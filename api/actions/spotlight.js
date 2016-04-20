import d3 from 'd3';
import {get, getFromRedis} from '../utils/ApiClient';
import {DI_API} from '../config';

class SpotlightAction {

  getIndicatorData(params) {
    const indicatorDataApi = `indicator?query={"concept":"${params}"}&fields={"_id":0}`;
    return get(DI_API, indicatorDataApi);
  }

  async spotlightBaseData() {
    const baseData = await getFromRedis('spotlight');
    return {
      themes: baseData.themes,
      entities: baseData.entities
    };
  }

  async spotlightData(params) {
    const indicatorDataRaw = await this.getIndicatorData(params);
    const indicatorData = indicatorDataRaw[0].data;
    const metaData = indicatorDataRaw[0].meta[0];
    const baseData = await getFromRedis('spotlight');
    const scale = this.createColorScale(baseData.colorRamp, metaData);
    const choroplethData = this.choroplethUpdateData(indicatorData, scale);
    return {
      data: choroplethData,
      domain: this.getIndicatorDomain(metaData),
      range: scale.range()
    };
  }

  getIndicatorDomain(meta) {
    return meta.range.replace(/ /g, '').split(',').map(val => parseFloat(val));
  }

  createColorScale(colorRamps, meta) {
    const domain = this.getIndicatorDomain(meta);
    const rampToUse = meta['global-picture-color-ramp'];
    const ramp = colorRamps.find(obj => obj.id === rampToUse);
    // const highorlow = meta.highorlow;
    // creating color range
    const range = new Array(domain.length + 1);
    range[0] = ramp.high;
    range[domain.length] = ramp.low;
    range[Math.floor(domain.length / 2)] = ramp.mid;
    for (let index = 0; index < domain.length + 1; index++) {
      if (!range[index]) {
        let color = null;
        if (index < domain.length / 2) {
          color = d3.interpolateRgb(ramp.high, ramp.mid)(index / domain.length);
        } else {
          color = d3.interpolateRgb(ramp.mid, ramp.low)(index / domain.length);
        }
        range[index] = color;
      }
    }
    // console.log(range);
    return d3.scale.threshold()
          .domain(domain)
          .range(range);
  }
  /**
  * I am making an assumption that all the
  * indicatorData is for one specific year
  * we are getting color values for arbitrary values
  */
  choroplethUpdateData(indicatorData, scale) {
    indicatorData.forEach(data => data.color = scale(data.value));
    return indicatorData;
  }
}

export const spotlightAction = new SpotlightAction();

export function spotlight(req, params) {
  return spotlightAction.spotlightData(params);
}

export function base() {
  return spotlightAction.spotlightBaseData();
}
