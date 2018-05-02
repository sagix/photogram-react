import React, { Component } from 'react';
class Sequence extends Component{
    render(){
        const color = this.props.color
        return (
            <span className={`tpl-small-sequence ${color? 'sequence-colored' : ''}`} style={{'background': color}}>{this.props.value}</span>
        )
    }
}

export default Sequence;
