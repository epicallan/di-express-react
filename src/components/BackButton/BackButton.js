import React, {PropTypes, Component} from 'react';

export default class BackButton extends Component {
  static propTypes = {
    selectOptionsHistory: PropTypes.object.isRequired,
    apiRequestObjHistory: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
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
