import {expect} from 'chai';
import themes from './themes.json';
import concepts from './concepts.json';
import {getThemeIndicators} from '../spotlightJob.js';

describe('adding theme-indicators to theme', () => {
  it('should return themes with indicators', () =>{
    const themesWithIndicators = getThemeIndicators(themes, concepts);
    // console.log('themes', themesWithIndicators);
    expect(themesWithIndicators).to.be.an('object');
    expect(themesWithIndicators['uganda-poverty'].indicators).to.have.length.above(1);
  });
});
