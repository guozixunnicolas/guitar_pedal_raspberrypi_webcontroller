import React from 'react';
import PropTypes from 'prop-types';

class ControlBar extends React.Component {
    handleChange() {
        
    }
    render() {
        return(
            <input type="range" onChange={this.handleChange()}></input>
        )
    }
}

ControlBar.PropTypes = {

}

export default ControlBar;