import React, { Component } from 'react';
import '../styles.css'
import './small.css';
class SmallImage extends Component{
    render(){
        return (
            <div className="tpl-small-ele">
                <img className="tpl-small-img" src={this.props.file} />
                <div className="tpl-small-legend">
                    <div className="tpl-small-indicators">
                        <span className="tpl-small-sequence"></span>
                        <img className="tpl-small-dot tpl-small-periode" />
                        <img className="tpl-small-dot dot-green fx" />
                    </div>
                    <div className="tpl-small-action-container">
                        <p className="tpl-small-action"></p>
                    </div>
                </div>
            </div>
        )
    }
}

export default SmallImage;
