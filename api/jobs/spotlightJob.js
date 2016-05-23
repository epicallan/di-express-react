import {get, saveInRedis} from '../utils/ApiClient';
import {DI_API} from '../config';
/**
 * getSpotlightBaseData: this functions gets data used in the spotlight maps that
 * doesn't change for each new request for data.
 * @return {object}
 */
async function getSpotlightBaseData() {
  const promises = [
    get(DI_API, 'reference/colorRamp'),
    // get(CMS_API, 'api/indicator/?format=json'), // RETURNS indicators (themes) // proof that we could use django
    get(DI_API, 'reference/uganda-theme'),
    get(DI_API, 'reference/uganda-district-entity'),
    get(DI_API, 'reference/concepts'), // returns concepts from which we get each themes indicators
  ];
  return Promise.all(promises);
}
/**
 * [leanThemeIndicatorObjs] cleans up the indicator objects by removing unneccessary fields
 * @param  {[object]} indicators []
 * @return {[object]}
 */
function leanThemeIndicatorObjs(indicators) {
  return indicators.map(indicator => {
    return {
      heading: indicator['laymans-heading'],
      slug: indicator.id,
      description: indicator['laymans-decription'],
      name: indicator.name,
      id: indicator._id
    };
  });
}
/**
 * getThemeIndicators adds theme indicators to themes
 * @param  {[type]} themes   the overall themes
 * @param  {array} concepts contains various theme indicators
 * @return {object} themes with indicators
 */
export function getThemeIndicators(themes, concepts) {
  const themesObjects = {};
  themes.forEach((theme) => {
    // get all the themes indicators
    const indicators = concepts.filter(concept =>
      concept.type === 'simple' && concept['map-theme'] === theme.id);
    // clean up the indicator objects so that they have less fields
    const cleanedUpIndicators = leanThemeIndicatorObjs(indicators);
    // create an array in which the indicators are an object in a theme array.
    const themeObj = { indicators: [], main: {} };

    cleanedUpIndicators.forEach(indicator => {
      if (indicator.slug !== theme.default) {
        themeObj.indicators.push(indicator);
      } else {
        themeObj.main = Object.assign(indicator, theme);
      }
    });
    Object.assign(themesObjects, {[theme.id]: themeObj});
  });
  return themesObjects;
}
/**
 * saveOptionsData saves all the various options data
 * this is the data used in coming up with the unbundling aid dropdowns/options
 * its also used in formulating requests for data
 * @return {obj}
 */
async function saveData() {
  const data = await getSpotlightBaseData();
  const themes = getThemeIndicators(data[1], data[3]);
  return saveInRedis('spotlight', {
    colorRamp: data[0],
    themes,
    entities: data[2]
  });
}

/**
 * sychronised the redis jobs so that i can close the client when they are done
 */
export default () => {
  saveData();
};
