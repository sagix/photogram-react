import React, { Component } from 'react';
import Container from '../Container';
import Sequence from '../Sequence';
import Period from '../Period';
import Action from '../Action';
import Image from '../Image'
import Fx from '../Fx';
import './index.css';
class SmallImage extends Component{

    handleClick = () => {
        this.props.onTile(this.props.file)
    }

    render(){
        const {sequence, action, periode, fx, url, color, colorDistribution} = this.props.file
        return (
            <Container className="tpl-small" color={color} colorDistribution={colorDistribution} onClick={this.handleClick}>
                <Image url={url}/>
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

export default SmallImage;
