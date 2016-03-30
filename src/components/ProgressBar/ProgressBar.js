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

  componentWillUpdate(nextProps) {
    if (nextProps.loaded) this.state.percent = 100;
    console.log(nextProps);
  }

  render() {
    return (
      <ProgressBarPlus percent={this.state.percent}
               autoIncrement={this.state.autoIncrement}
               intervalTime={this.state.intervalTime}/>
    );
  }
}
