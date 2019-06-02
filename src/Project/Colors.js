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
    const hidePicker = () => this.setState({ pickerVisible: false })
    const showPicker = () => this.setState({ pickerVisible: true })

    return (
      <div onMouseEnter={ showPicker } onMouseLeave={ hidePicker }>
        <button onClick={ onTogglePicker }
         style={{
             padding:2,
             borderRadius:4
        }}><span style={{
            color: "transparent",
            backgroundColor:this.state.color,
            display:"block",
            width:24,
            height:24,
            borderRadius:2
        }}></span></button>

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
                    <tbody>
                    {
                        Object.keys(this.props.colors).map((key) => {
                            return(
                                <tr key={key}><td>
                                <ColorWrapper
                                    color={ this.props.colors[key] }
                                    onChangeComplete={ (color, event) => {
                                        this.props.onColorChange({[key]: color.hex})
                                     }}
                                  />
                                </td>
                                <td>{key}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            )
        }else{
            return null
        }
    }
}

export default Colors;
