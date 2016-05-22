import d3 from 'd3';
import {get, getFromRedis} from '../utils/ApiClient';
import {DI_API} from '../config';
/* eslint-disable id-length */
import _ from 'lodash';

class SpotlightAction {

  getIndicatorData(params) {
    const indicatorDataApi = `indicator?query={"concept":"${params}"}&fields={"_id":0}`;
    return get(DI_API, indicatorDataApi);
  }

  spotlightData(indicatorDataRaw, baseData ) {
    const indicatorData = indicatorDataRaw.data;
    const metaData = indicatorDataRaw.meta[0];
    const scale = this.createColorScale(baseData.colorRamp, metaData);
    const choroplethData = this.choroplethUpdateData(indicatorData, scale);
    return {
      data: choroplethData,
      domain: this.getIndicatorDomain(metaData),
      range: scale.range(),
      years: Object.keys(choroplethData)
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
   * [groupBy groups indicatorData by year]
   * @param  {[array]} data [indicatorData with indicator objects with years]
   * @return {[object]}      [grouped indicatorData]
   */
  groupIndicatorData = data =>_.groupBy(data, obj => obj.year);
  /**
  * I am making an assumption that all the
  * indicatorData is for one specific year
  * we are getting color values for arbitrary values
  */
  choroplethUpdateData(indicatorData, scale) {
    // group indicator data by year
    const groupedData = this.groupIndicatorData(indicatorData);
    Object.keys(groupedData).forEach(year => {
      groupedData[year].forEach(obj => {
        obj.color = scale(obj.value);
      });
    });
    return groupedData;
  }
}


export const spotlightAction = new SpotlightAction();

export default async function spotlight(req, params) {
  if (params[0] === 'base') return spotlightAction.spotlightBaseData(); // for the base route
  const indicatorDataRaw = await spotlightAction.getIndicatorData(params);
  const baseData = await getFromRedis('spotlight');
  return spotlightAction.spotlightData(indicatorDataRaw, baseData);
}
