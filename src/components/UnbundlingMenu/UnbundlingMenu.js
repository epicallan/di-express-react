import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';

@connect(
  state => ({
    sector: state.unbundling.sectors,
    bundle: state.unbundling.bundle,
    channel: state.unbundling.channel,
    aidTo: state.unbundling['id-to'],
    aidFrom: state.unbundling['id-from']
  })
)
export default class UnbundlingMenu extends Component {
  static propTypes = {
    sector: PropTypes.array.isRequired,
    bundle: PropTypes.array.isRequired,
    channel: PropTypes.array.isRequired,
    aidTo: PropTypes.array.isRequired,
    aidFrom: PropTypes.array.isRequired
  };

  createSelectOptions = (items) => {
    return items.map(item => (
        <option key = {item._id} value = {item.id}> {item.name} </option>
      )
    );
  }

  render() {
    const {bundle} = this.props;
    return (
      <section>
        <h3> Menu Goes here </h3>
        <div className="select">
          <select>
            {this.createSelectOptions(bundle)}
          </select>
        </div>
      </section>
    );
  }
}
