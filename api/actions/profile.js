import {get} from '../utils/externalApiClient';

class ProfileAction {
  getEntities() {
    return get('reference/uganda-district-entity');
  }
  getEntity(entities, id) {
    return entities.find(row => row.id === id);
  }
}

export const profileAction = new ProfileAction();

export default async function profile(req, params) {
  const entities = await profileAction.getEntities();
  return profileAction.getEntity(entities, params[0]);
}
