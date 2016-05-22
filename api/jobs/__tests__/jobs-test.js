import {expect} from 'chai';
import themes from './themes.json';
import concepts from './concepts.json';
import {getThemeIndicators} from '../spotlightJob.js';

describe('adding theme-indicators to theme', () => {
  it('should return themes with indicators', () =>{
    const themesWithIndicators = getThemeIndicators(themes, concepts);
    expect(themesWithIndicators).to.be.an('array');
    expect(themesWithIndicators[0].indicators).to.have.length.above(1);
  });
});
