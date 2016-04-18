import {expect} from 'chai';
import oda from './oda.json';
import nationalOda from './tz.json';
import options from './options.json';
import {unbundlingAction} from '../unbundling';

/* eslint-disable func-names  */
describe('unbundlingAction', function() {
  it('should return activeLevel', () => {
    const group = {
      '_id': '$id-to',
      'total': {'$sum': '$value'}
    };
    const activeLevel = unbundlingAction.getActiveLevelKey(group);
    expect(activeLevel).to.be.a('string');
    expect(activeLevel).to.equal('id-to');
  });

  it('should process world wide ODA Data', ()=>{
    const processed = unbundlingAction.processODAData(oda, options['id-to']);
    // console.log(options['id-to'][0]);
    expect(processed).to.be.an('array');
    expect(processed[0]).to.have.property('id');
    expect(processed[0]).to.have.property('donor-recipient-type');
  });

  it('should process national wide ODA Data based on provided option', ()=>{
    const processed = unbundlingAction.processODAData(nationalOda, options['id-from']);
    // console.log(options['id-to'][0]);
    expect(processed).to.be.an('array');
    expect(processed[0]).to.have.property('id');
    expect(processed[0]).to.have.property('donor-recipient-type');
  });
});
