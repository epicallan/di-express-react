import {expect} from 'chai';
import colorRamps from './colorRamps.json';
import meta from './meta.json';
import {spotlight} from '../spotlight';


/* eslint-disable func-names  */
describe('spotlight', function() {
  this.timeout(5000);

  it.skip('should fetch all spotlight data', async (done) => {
    const data = await spotlight.getAllData('uganda-poverty-headcount');
    expect(data).to.be.an('array');
    done();
  });

  it('should create color scale', () => {
    // const metaData = JSON.parse(meta);
    // console.log(meta.meta[0].series);
    const scale = spotlight.createColorScale(colorRamps, meta.meta[0]);
    const color = scale(43);
    console.log(color);
    expect(color).to.be.a('string');
  });
});
