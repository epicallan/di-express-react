import { expect} from 'chai';
import { browserHistory } from 'react-router';
import createStore from '../../create';
import ApiClient from '../../../helpers/ApiClient';
import * as spotlightActions from '../spotlight';

const client = new ApiClient();

describe('spotlight store', () => {
  const store = createStore(browserHistory, client);
  before(()=>{
    expect(store).to.be.an('object');
    expect(store).to.have.ownProperty('dispatch');
  });

  it.skip('should get data from api into store', () => {
    store.dispatch(spotlightActions.load());
    const spotlightStore = store.getState().spotlight;
    console.log(spotlightStore);
    expect(spotlightStore.data).to.be.an('array');
  });
});
