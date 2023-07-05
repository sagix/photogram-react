import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
class ColorWrapper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pickerVisible: false,
        }
    }


    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);

    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    escFunction = (event) => {
        if (event.keyCode === 27) {
            this.setState({ pickerVisible: false });
        }
    }

    handleColorChange = (color, event) => {
        this.props.onChangeComplete(color, event)
    }

    render() {
        const onTogglePicker = () => this.setState({ pickerVisible: !this.state.pickerVisible })

        return (
            <span >
                {this.state.pickerVisible && (
                    <div className="outsidePicker" style={{
                        position: 'fixed',
                        right: '0',
                        top: '0',
                        left: '0',
                        bottom: '0',
                    }} onClick={() => this.setState({ pickerVisible: false })} />
                )}
                <button onClick={onTogglePicker}
                    style={{
                        padding: 2,
                        borderRadius: 4
                    }}><span style={{
                        color: "transparent",
                        backgroundColor: this.props.color,
                        display: "block",
                        width: 24,
                        height: 24,
                        borderRadius: 2
                    }}></span></button>

                {this.state.pickerVisible && (
                    <div style={{
                        position: 'fixed',
                        right: '20rem',
                        bottom: '0',
                    }}>
                        <SketchPicker
                            color={this.props.color}
                            onChangeComplete={this.handleColorChange}
                        />
                    </div>
                )}

            </span>
        )
    }
}

export default ColorWrapper;