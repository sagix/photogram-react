import React, { Component } from 'react';
import svgFx from './auto-fix.svg';
import '../dot.css'
import './index.css'
class Fx extends Component{
    render(){
        return (
            <img className={`dot dot-green fx ${this.props.value ? '' : 'hide'}`} src={svgFx} alt="special effects indicator"/>
        )
    }
}

export default Fx;
