import {expect} from 'chai';
import oda from './oda.json';
import options from './options.json';
import {unbundlingAction} from '../unbundling';

/* eslint-disable func-names  */
describe('unbundlingAction', function() {
  it('should return activeLevel', () => {
    const match = {
      'year': 2013,
      'id-to': 'NG'
    };
    const activeLevel = unbundlingAction.getActiveLevelKey(match);
    expect(activeLevel).to.be.a('string');
    expect(activeLevel).to.equal('id-to');
  });
  it('should return null for activeLevel key if not supplied', () => {
    const match = {
      'year': 2013
    };
    const activeLevel = unbundlingAction.getActiveLevelKey(match);
    expect(activeLevel).to.be.a('null');
  });

  it('should process ODA Data', ()=>{
    const processed = unbundlingAction.processODAData(oda, options['id-to']);
    // console.log(options['id-to'][0]);
    expect(processed).to.be.an('array');
    expect(processed[0]).to.have.property('id');
    expect(processed[0]).to.have.property('donor-recipient-type');
  });
});
