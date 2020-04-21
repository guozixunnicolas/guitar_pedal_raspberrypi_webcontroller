import React from 'react';
import ExtendedString from '../utils/functions';
import '../css/bang.css';

class ControlBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            checked: false,
            label: null,
            noLabelLegend: false,
            bang: false
        };
    }
    handleChange(event) {
        event.target.value = event.target.checked ? 1 : 0;
        if (event.target.checked)
            event.target.value = this.state.bang ? "bang" : 1;
        else
            event.target.value = 0;
        console.log(event.target.value);
        this.setState({ value: event.target.value, checked: event.target.checked });
        this.props.onChange(event);
        this.props.onSubmit(event);
        //  Reset it back to 0 because bang is similar to an edge-rising/impulse
        if (this.state.bang) {
            event.target.checked = false;
            event.target.value = 0;
            this.setState({value: event.target.value, checked: event.target.checked});
            this.props.onChange(event);
        }
    }
    componentDidMount() {
        this.setState({
            value: this.props.value,
            checked: this.props.value === 0 ? false : true,
            label: this.props.label,
            noLabelLegend: this.props.noLabelLegend,
            bang: this.props.bang
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
            checked: nextProps.value === 0 ? false : true,
            label: nextProps.label,
            noLabelLegend: nextProps.noLabelLegend,
            bang: this.props.bang
        })
    }
    generateInput() {
        return(
            <div>
            <input
                id={this.state.label}
                type={this.state.bang ? "radio" : "checkbox"}
                className={this.props.className}
                onChange={this.handleChange.bind(this)}
                checked={this.state.checked}
                value={this.state.value}
            />
            {!this.state.bang && <label className="tgl-btn" data-tg-off="OFF" data-tg-on="ON" htmlFor={this.state.label}></label>}
            {this.state.bang && <label htmlFor={this.state.label} className="bang__label">Bang!</label>}
            </div>
        )
    }
    generateHeader() {
        return (
            <div style={{ 
                marginTop: "20px", 
                marginBottom: "20px", 
                textAlign: "center", 
                display: "flex", 
                justifyContent: "center", 
                flexDirection: "column", 
                alignItems: "center" }}
                >
                <span style={{ fontSize: "15px", marginBottom: "20px" }}>
                    {" "}
                    {ExtendedString.toProperCase(this.state.label)}
                </span>
                {this.generateInput()}
            </div>
        )
    }
    render() {
        if(this.state.noLabelLegend) {
            return(
                this.generateInput()
            );
        }
        else {
            return (
                <div id={`${this.state.label}-control`}>
                    {this.generateHeader()}
                </div>
            );
        }
    }
}

export default ControlBar;