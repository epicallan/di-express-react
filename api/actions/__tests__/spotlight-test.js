import {expect} from 'chai';
import colorRamps from './colorRamps.json';
import meta from './meta.json';
import {spotlight} from '../spotlight';
import indicatorData from './indicatorData.json';

/* eslint-disable func-names  */
describe('spotlight', function() {
  this.timeout(5000);

  it.skip('should fetch all spotlight data', async (done) => {
    const data = await spotlight.getAllData('uganda-poverty-headcount');
    expect(data).to.have.length.above(2);
    done();
  });

  it('should create color scale', () => {
    const scale = spotlight.createColorScale(colorRamps, meta.meta[0]);
    const color = scale(43);
    expect(color).to.equal('#900924');
  });
  it('should create data for updating the chorolepth', () => {
    // simplified scale function
    const scale = value => value * 0.5;
    const obj = spotlight.choroplethUpdateData(indicatorData, scale);
    expect(obj[0].color).to.equal(37);
  });
});
