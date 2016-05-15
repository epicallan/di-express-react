import React, {PropTypes, Component} from 'react';

export default class BackButton extends Component {
  static propTypes = {
    selectOptionsHistory: PropTypes.object.isRequired,
    apiRequestObjHistory: PropTypes.array.isRequired,
    loadDataFn: PropTypes.func.isRequired
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
