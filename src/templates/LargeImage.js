import React, { Component } from 'react';
import Sequence from './Sequence';
import Periode from './Periode';
import Fx from './Fx';
import '../styles.css'
import './large.css';
class LargeImage extends Component{

        render(){
            const {id, sequence, action, place, periode, fx, url, color} = this.props.file
            return (
                <div className="tpl-large-ele">
                    <div className="tpl-large-img-container">
                        <img className="tpl-large-img" src={url} />
                    </div>
                    <div className="tpl-large-legend">
                        <div className="tpl-large-indicators">
                            <Sequence color={color} value={sequence}/>
                            <Periode value={periode}/>
                            <Fx value={fx}/>
                        </div>
                        <div className="tpl-large-action-container">
                            <p className="tpl-large-action">{action}</p>
                        </div>
                    </div>
                </div>
            )
        }
}

export default LargeImage;
