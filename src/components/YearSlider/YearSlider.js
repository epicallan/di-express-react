import React, { Component, PropTypes} from 'react';
import Slider from 'react-rangeslider';
// import styles from './YearSlider.scss';

export default class YearSlider extends Component {

  static propTypes = {
    years: PropTypes.array.isRequired,
    updateCurrentYear: PropTypes.func.isRequired,
    currentYear: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.rangeHandle = document.getElementsByClassName('rangeslider__handle')[0];
    // this.rangeHandle = document.getElementsByClassName('rangeHandle__handle');X
    this.rangeHandle.innerHTML = `<span>${this.props.currentYear}</span>`;
  }

  handleChange = (year) => {
    // this.rangeHandle = document.getElementsByClassName('rangeslider__handle');
    // console.log('in handler', this.rangeHandle);
    this.props.updateCurrentYear(year);
    this.rangeHandle.innerHTML = `<span>${year}</span>`;
  }

  render() {
    const {currentYear, years} = this.props;
    // coerce into number type
    const max = years[years.length - 1];
    const min = years[0];
    const value = parseInt(currentYear, 10);
    return (
      <article>
        <div className = "row">
          <div className = "col-md-6"><p>{min}</p></div>
          <div className = "col-md-6"><p className="text-right">{max}</p></div>
        </div>
        <div className= "row">
          <Slider
            min = {min}
            max = {max}
            value = {value}
            step = {1}
            onChange={this.handleChange} />
        </div>
      </article>
    );
  }

}
