import React from 'react';
import '../css/equalizerButton.css';


class EqualizerButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _equalizer_ref: React.createRef(),
            _btn_ref: React.createRef(),
            active: false
        }
    }
    handleClick(event) {
        let wasActive = this.state.active;
        this.setState({
            active: true
        }, () => {
            this.state._btn_ref.current.setAttribute('class', this.state.active ? "equalizer-btn active" : "equalizer-btn");
            if (!wasActive) {
                for(const children of this.state._equalizer_ref.current.children) {
                    children.classList.toggle('playEqualizer')
                }
                console.log(this.state._btn_ref.current);
                this.props.onClick(this.state.active);
            }
        })
    }
    render() {
        return(
            <div className="equalizer-btn" onClick={(e) => this.handleClick(e)} ref={this.state._btn_ref}>
                <div className="equalizer" id="equalizer-btn-first">
                    <ul id="bares-container" ref={this.state._equalizer_ref}>
                        <li className="first-bar"></li>
                        <li className="second-bar"></li>
                        <li className="third-bar"></li>
                        <li className="fourth-bar"></li>
                        <li className="fifth-bar"></li>

                        <li className="first-bar"></li>
                        <li className="second-bar"></li>
                        <li className="third-bar"></li>
                        <li className="fourth-bar"></li>
                        <li className="fifth-bar"></li>

                        <li className="first-bar"></li>
                        <li className="second-bar"></li>
                        <li className="third-bar"></li>
                        <li className="fourth-bar"></li>
                        <li className="fifth-bar"></li>

                        <li className="first-bar"></li>
                        <li className="second-bar"></li>
                        <li className="third-bar"></li>
                        <li className="fourth-bar"></li>
                        <li className="fifth-bar"></li>

                        <li className="first-bar"></li>
                        <li className="second-bar"></li>
                        <li className="third-bar"></li>
                        <li className="fourth-bar"></li>
                        <li className="fifth-bar"></li>

                        <li className="first-bar"></li>
                        <li className="second-bar"></li>
                        <li className="third-bar"></li>
                        <li className="fourth-bar"></li>
                        <li className="fifth-bar"></li>

                    </ul>
                </div>
            </div>
        );
    }
}

export default EqualizerButton;