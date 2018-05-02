import React, { Component } from 'react';
import Sequence from '../Sequence';
import Period from '../Period';
import Action from '../Action';
import Image from '../Image'
import Fx from '../Fx';
import '../../styles.css'
import './index.css';
class SmallImage extends Component{
    render(){
        const {id, sequence, action, place, periode, fx, url, color} = this.props.file
        return (
            <div className="tpl-small ele">
                <Image url={url}/>
                <div className="legend">
                    <div className="indicators">
                        <Sequence color={color} value={sequence}/>
                        <Period value={periode}/>
                        <Fx value={fx}/>
                    </div>
                    <Action value={action}/>
                </div>
            </div>
        )
    }
}

export default SmallImage;
