import fetch from 'node-fetch';
import d3 from 'd3';
import {DI_API_BASE} from '../config';

class Spotlight {

  async get(urlPart) {
    const url = `${DI_API_BASE}/${urlPart}`;
    const res = await fetch(url);
    // we are returning a promise
    return res.json();
  }

  getAllData(params) {
    const indicatorDataApi = `indicator?query={"concept":"${params}"}&fields={"_id":0}`;
    const promises = [
      this.get(indicatorDataApi),
      this.get('reference/colorRamp'),
      this.get('reference/uganda-theme')
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
      themes: themeData
    };
  }
  createColorScale(colorRamps, meta) {
    const domain = meta.range.replace(/ /g, '').split(',').map(val => parseFloat(val));
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

export const spotlight = new Spotlight();

export default function(req, params) {
  return spotlight.spotlightData(params);
}
