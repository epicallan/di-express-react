import React, {PropTypes, Component} from 'react';

export default class CompareButton extends Component {
  static propTypes = {
    changeChartCount: PropTypes.func.isRequired,
  }

  state = {compareBtnLable: 'Compare'}

  compareClickHandler = () => {
    if (this.state.compareBtnLable === 'Compare') {
      this.setState({compareBtnLable: 'X'});
      this.props.changeChartCount(2);
    } else {
      this.setState({compareBtnLable: 'Compare'});
      this.props.changeChartCount(1);
    }
  }

  render() {
    const styles = require('./CompareButton.scss');
    return (
      <div className = {styles.comparisonBtn}>
        <button className="btn btn--on-light btn--square" onClick= {this.compareClickHandler.bind(this)}>
            <span>{this.state.compareBtnLable}</span>
        </button>
      </div>
    );
  }
}
