import React, { Component } from 'react';
import './Container.css'
class Container extends Component{

    render(){
        let backgroundColor
        if(this.props.colorDistribution === "full"){
            backgroundColor= this.props.color
        }else{
            backgroundColor= null
        }
        return (
            <div className={`ele ${this.props.className}`} style={{backgroundColor: backgroundColor}} >
                {this.props.children}
            </div>
        )
    }
}

export default Container;
