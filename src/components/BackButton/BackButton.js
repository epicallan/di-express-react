import React, {PropTypes, Component} from 'react';

export default class BackButton extends Component {
  static propTypes = {
    cacheKeys: PropTypes.array.isRequired,
    hydrateStore: PropTypes.func.isRequired,
    updateCacheKeys: PropTypes.func.isRequired
  }

  backClickHandler = () => {
    const {cacheKeys, hydrateStore, updateCacheKeys} = this.props;
    // get latest cacheKey
    const cacheKey = cacheKeys.pop();
    // hydrateStore
    hydrateStore(cacheKey);
    // updateCacheKeys
    updateCacheKeys(cacheKeys);
  }
  render() {
    const styles = require('./BackButton.scss');
    return (
      <div className={styles.back}>
        <i className={styles.navigateleft} onClick={this.backClickHandler}></i>
      </div>
    );
  }
}
