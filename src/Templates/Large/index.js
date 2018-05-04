import React, { Component } from 'react';
import Container from '../Container';
import Sequence from '../Sequence';
import Period from '../Period';
import Action from '../Action';
import Image from '../Image'
import Fx from '../Fx';
import './index.css';
class LargeImage extends Component{

    render(){
        const {id, sequence, action, place, periode, fx, url, color, colorDistribution} = this.props.file

        return (
            <Container className="tpl-large" color={color} colorDistribution={colorDistribution}>
                <div className="img-container">
                    <Image url={url}/>
                </div>
                <div className="legend">
                    <div className="indicators">
                        <Sequence color={color} value={sequence}/>
                        <Period value={periode}/>
                        <Fx value={fx}/>
                    </div>
                    <Action value={action}/>
                </div>
            </Container>
        )
    }
}

export default LargeImage;
