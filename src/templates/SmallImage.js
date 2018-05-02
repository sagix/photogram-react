import React, { Component } from 'react';
import Action from './Action';
import Sequence from './Sequence';
import Periode from './Periode';
import Fx from './Fx';
import svgEmpty from './svg/empty.svg';
import '../styles.css'
import './small.css';
class SmallImage extends Component{
    render(){
        const {id, sequence, action, place, periode, fx, url, color} = this.props.file
        return (
            <div className="tpl-small-ele">
                <img className="tpl-small-img" src={url ? url : svgEmpty} />
                <div className="tpl-small-legend">
                    <div className="tpl-small-indicators">
                        <Sequence color={color} value={sequence}/>
                        <Periode value={periode}/>
                        <Fx value={fx}/>
                    </div>
                    <Action value={action}/>
                </div>
            </div>
        )
    }
}

export default SmallImage;
