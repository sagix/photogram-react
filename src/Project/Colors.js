import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import './Colors.css'

class ColorWrapper extends Component {
  state = {
    color: this.props.color,
    pickerVisible: false,
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
    this.setState({ color: color.hex })
    this.props.onChangeComplete(color, event)
  }

  render() {
    const onTogglePicker = () => this.setState({ pickerVisible: !this.state.pickerVisible })

    return (
      <div >
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
            backgroundColor: this.state.color,
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
              color={this.state.color}
              onChangeComplete={this.handleColorChange}
            />
          </div>
        )}

      </div>
    )
  }
}


class Colors extends Component {

  handleChangeComplete

  render() {

    if (this.props.colors) {
      return (
        <table className={this.props.className}>
          <tbody>
            {
              Object.keys(this.props.colors).map((key) => {
                return (
                  <tr key={key}><td>
                    <ColorWrapper
                      color={this.props.colors[key]}
                      onChangeComplete={(color, event) => {
                        this.props.onColorChange({ [key]: color.hex })
                      }}
                    />
                  </td>
                    <td>{key}</td>
                    <td><button className="btn-color" onClick={(event) => {
                      event.preventDefault()
                      this.props.onDelete(key)
                    }}>&#x2715;</button></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      )
    } else {
      return null
    }
  }
}

export default Colors;
