import {get} from '../utils/externalApiClient';

class ProfileAction {
  getEntities() {
    return get('reference/uganda-district-entity');
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
