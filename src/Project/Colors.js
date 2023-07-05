import React, { Component } from 'react';
import ColorWrapper from './ColorWrapper';
import './Colors.css'


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
