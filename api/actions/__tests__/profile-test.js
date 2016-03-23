import {expect} from 'chai';
import {profileAction} from '../profile';
import entities from './entities.json';

/* eslint-disable func-names  */
describe('profileAction', function() {
  it('should get entity from entities', () => {
    const entity = profileAction.getEntity(entities, 'abim');
    // console.log(entity);
    expect(entity.name).to.equal('Abim');
  });
});
