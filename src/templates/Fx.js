import React, { Component } from 'react';
import svgFx from './svg/auto-fix.svg';
class Fx extends Component{
    render(){
        return (
            <img className={`tpl-small-dot dot-green fx ${this.props.value ? '' : 'hide'}`} src={svgFx}/>
        )
    }
}

export default Fx;
