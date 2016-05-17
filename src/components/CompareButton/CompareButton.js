import React, {PropTypes, Component} from 'react';

export default class CompareButton extends Component {

  static propTypes = {
    changeChartCount: PropTypes.func.isRequired,
    compareBtnLable: PropTypes.string.isRequired,
    changeCompareBtnLable: PropTypes.func.isRequired
  }

  compareClickHandler = () => {
    if (this.props.compareBtnLable === 'Compare') {
      this.props.changeCompareBtnLable('X');
      this.props.changeChartCount(2);
    } else {
      this.props.changeCompareBtnLable('Compare');
      this.props.changeChartCount(1);
    }
  }

  render() {
    const styles = require('./CompareButton.scss');
    return (
      <div className = {styles.comparisonBtn}>
        <button className="btn btn--on-light btn--square" onClick= {this.compareClickHandler.bind(this)}>
            <span>{this.props.compareBtnLable}</span>
        </button>
      </div>
    );
  }
}
