import {get} from '../utils/externalApiClient';
import {DI_API} from '../config';
class ProfileAction {
  getEntities() {
    return get(DI_API, 'reference/uganda-district-entity');
  }
  getEntity(entities, slug) {
    return entities.find(row => row.slug === slug);
  }
}

export const profileAction = new ProfileAction();

export default async function profile(req, params) {
  const entities = await profileAction.getEntities();
  return profileAction.getEntity(entities, params[0]);
}
