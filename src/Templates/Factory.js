import React, { Component } from 'react';

class TemplateFactory extends Component{

    renderImage(){
        if(this.props.type){
            switch (this.props.type) {
                case 'small':
                    let Small = require('./Small').default
                    return React.createElement(Small, {file: this.props.file})
                case 'large':
                    let Large = require('./Large').default
                    return React.createElement(Large, {file: this.props.file})
                default:
                    return null;
            }
        }
    }
    render() {
        return this.renderImage()
    }
}

export default TemplateFactory
