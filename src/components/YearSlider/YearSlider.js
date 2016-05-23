import React, { Component, PropTypes} from 'react';
import Slider from 'react-rangeslider';
// import styles from './YearSlider.scss';

export default class YearSlider extends Component {

  static propTypes = {
    years: PropTypes.array.isRequired,
    updateCurrentYear: PropTypes.func.isRequired,
    currentYear: PropTypes.string.isRequired
  }

  handleChange = (year) => {
    this.props.updateCurrentYear(year);
  }

  render() {
    const {currentYear, years} = this.props;
    // coerce into number type
    const max = years[years.length - 1];
    const min = years[0];
    const value = parseInt(currentYear, 10);
    return (
      <article>
					<Slider
						min = {min}
						max = {max}
            value = {value}
            step = {1}
						onChange={this.handleChange} />
					<div className="value">{value}</div>
      </article>
    );
  }

}
