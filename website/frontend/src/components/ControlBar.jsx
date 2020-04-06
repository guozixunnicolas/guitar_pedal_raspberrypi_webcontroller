import React from 'react';
import ExtendedString from '../utils/functions';
import '../css/control.css';

class ControlBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            min: null,
            max: null,
            step: 1,
            label: null,
            noLabelLegend: false
        };
    }
    handleSliderChange(event) {
        // console.log(`From child component ${this.state.label}: ${event.target.value}`);
        this.setState({ value: event.target.value });
        this.props.onChange(event);
    }
    componentDidMount() {
        this.setState({
            value: this.props.value,
            label: this.props.label,
            step: this.props.step,
            noLabelLegend: this.props.noLabelLegend
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
            label: nextProps.label,
            step: nextProps.step,
            noLabelLegend: nextProps.noLabelLegend
        })
    }
    generateInput() {
        return(
            <input
                id={this.state.label}
                type="range"
                min={this.props.min}
                max={this.props.max}
                className={this.props.className}
                onChange={this.handleSliderChange.bind(this)}
                onMouseUpCapture={(e) => this.props.onMouseUpCapture(e)}
                onTouchEndCapture={(e) => this.props.onMouseUpCapture(e)}
                value={this.state.value}
                step="1"
                orient={this.props.orient}
            />
        )
    }
    generateSlider() {
        return (
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                <span style={{ fontSize: "13px" }}>
                    {" "}
                    {ExtendedString.toProperCase(this.state.label)} ({this.state.value})
                </span>
                <input
                    id={this.state.label}
                    type="range"
                    min={this.props.min}
                    max={this.props.max}
                    className={this.props.className}
                    onChange={this.handleSliderChange.bind(this)}
                    onMouseUpCapture={(e) => this.props.onMouseUpCapture(e)}
                    onTouchEndCapture={(e) => this.props.onMouseUpCapture(e)}
                    value={this.state.value}
                    step={this.props.step}
                    orient={this.props.orient}
                />
            </div>
        )
    }
    render() {
        if(this.state.noLabelLegend) {
            return(
                <input
                    id={this.state.label}
                    type="range"
                    min={this.props.min}
                    max={this.props.max}
                    className={this.props.className}
                    onChange={this.handleSliderChange.bind(this)}
                    onMouseUpCapture={(e) => this.props.onMouseUpCapture(e)}
                    onTouchEndCapture={(e) => this.props.onMouseUpCapture(e)}
                    value={this.state.value}
                    step={this.state.step}
                    orient={this.props.orient}
                />
            );
        }
        else {
            return (
                <div id={`${this.state.label}-control`}>
                    {this.generateSlider()}
                </div>
            );
        }
    }
}

export default ControlBar;