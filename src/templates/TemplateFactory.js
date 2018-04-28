import React, { Component } from 'react';

class TemplateFactory extends Component{

    constructor(props){
        super(props);
    }

    renderImage(){
        if(this.props.type){
            switch (this.props.type) {
                case 'small':
                    let SmallImage = require('./SmallImage').default
                    return React.createElement(SmallImage, {file: this.props.file})
                case 'large':
                let LargeImage = require('./LargeImage').default
                    return React.createElement(LargeImage, {file: this.props.file})
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
