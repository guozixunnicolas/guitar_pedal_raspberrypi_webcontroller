import React from 'react';
import '../css/control.css';

class ControlBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            label: null,
        };
    }
    handleSliderChange(event) {
        this.setState({ value: event.target.value });
    }
    componentDidMount() {
        this.setState({
            value: this.props.value,
            label: this.props.label
        });
    }
    generateSlider() {
        return (
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                <div>
                <span style={{ fontSize: "16px", marginBottom: "6px" }}>
                    {" "}
                    {this.state.label} ({this.state.value})
                </span>
                </div>
                <input
                    id={this.state.label}
                    type="range"
                    defaultValue="0"
                    min={this.props.min}
                    max={this.props.max}
                    className={this.props.className}
                    onChange={this.handleSliderChange.bind(this)}
                    value={this.state.value}
                    step="1"
                />
            </div>
        )
    }
    render() {
        return (
            <div>
                {this.generateSlider()}
            </div>
        )
    }
}

export default ControlBar;