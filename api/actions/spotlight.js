import d3 from 'd3';
import {get} from '../utils/externalApiClient';

class SpotlightAction {
  getAllData(params) {
    const indicatorDataApi = `indicator?query={"concept":"${params}"}&fields={"_id":0}`;
    const promises = [
      get(indicatorDataApi),
      get('reference/colorRamp'),
      get('reference/uganda-theme'),
      get('reference/uganda-district-entity')
    ];
    return Promise.all(promises);
  }

  async spotlightData(params) {
    const allData = await this.getAllData(params);
    const indicatorData = allData[0].data;
    const metaData = allData[0].meta[0];
    const colorRamps = allData[1];
    const scale = this.createColorScale(colorRamps, metaData);
    const choroplethData = this.choroplethUpdateData(indicatorData, scale);
    const themeData = allData[2];
    return {
      meta: metaData,
      data: choroplethData,
      themes: themeData,
      entities: allData[3],
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
  */
  choroplethUpdateData(indicatorData, scale) {
    indicatorData.forEach(data => data.color = scale(data.value));
    return indicatorData;
  }
}

export const spotlightAction = new SpotlightAction();

export default function spotlight(req, params) {
  return spotlightAction.spotlightData(params);
}
