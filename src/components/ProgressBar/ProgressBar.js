import React, { Component, PropTypes} from 'react';
import ProgressBarPlus from 'react-progress-bar-plus';
import {connect} from 'react-redux';

@connect(
  state => ({
    loaded: state.spotlight.loaded
  })
)
export default class ProgressBar extends Component {
  static propTypes = {
    loaded: PropTypes.bool.isRequired
  }

  state = {
    percent: 0,
    autoIncrement: true,
    intervalTime: (Math.random() * 500)
  };

  loadProgress = () => {
    let percent = this.state.percent;
    if (this.props.loaded === true) percent = 100;
    return percent;
  }

  render() {
    return (
      <ProgressBarPlus percent={this.loadProgress()}
               autoIncrement={this.state.autoIncrement}
               intervalTime={this.state.intervalTime}/>
    );
  }
}
