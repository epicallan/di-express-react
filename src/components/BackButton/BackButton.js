import React, {PropTypes, Component} from 'react';
import cx from 'classnames';

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
    const visible = this.props.cacheKeys.length ? 'show' : 'hide'; // TODO show only on hover
    return (
      <div className={cx(styles.back, visible)}>
        <i className={cx(styles.navigateleft, 'fa', 'fa-chevron-left')} onClick={this.backClickHandler}></i>
      </div>
    );
  }
}
