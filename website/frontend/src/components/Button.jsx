import React from 'react'
import '../css/button.css';

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        }
    }
    handleChange(event) {
        this.props.onChange(event);
    }
    componentDidMount() {
        this.setState({
            clicked: this.props.clicked
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            clicked: nextProps.clicked
        })
    }
    render() {
        return(
            <div class="grid">
                <div class="button" role="button" onClick={this.handleChange.bind(this)}>
                    {this.props.value}
                </div>
            </div>
        )
    }
}

export default Button;