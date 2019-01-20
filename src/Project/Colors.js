import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

class ColorWrapper extends Component{
    state = {
        color: this.props.color,
        pickerVisible: false,
  }

  handleColorChange = (color, event) => {
      this.setState({color: color.hex})
      this.props.onChangeComplete(color, event)
  }

  render() {
    const onTogglePicker = () => this.setState({ pickerVisible: !this.state.pickerVisible })

    return (
      <div>
        <button onClick={ onTogglePicker }
         style={{
            color: "transparent",
            backgroundColor:this.state.color,
         }}>>
          {this.state.color}
        </button>

        { this.state.pickerVisible && (
          <div style={{
              position: 'absolute',
              right:0,
           }}>
            <SketchPicker
              color={this.state.color}
              onChangeComplete={ this.handleColorChange }
            />
          </div>
        ) }
      </div>
    )
  }
}


class Colors extends Component{

    handleChangeComplete

    render(){

        if(this.props.colors){
            return (
                <table className="colors">
                    {
                        Object.keys(this.props.colors).map((key) => {
                            return(
                                <tr><td>{key}</td><td>
                                <ColorWrapper
                                    color={ this.props.colors[key] }
                                    onChangeComplete={ (color, event) => {
                                        this.props.onColorChange({[key]: color.hex})
                                     }}
                                  />
                                </td></tr>
                            )
                        })
                    }
                </table>
            )
        }else{
            return null
        }
    }
}

export default Colors;
