import React, { Component } from 'react';
import FontSizeAdjuster from './FontSizeAdjuster'
class Action extends Component{

    constructor(props){
        super(props)
        this.textNode = React.createRef();
        this.fontSizeAdjuster = new FontSizeAdjuster(.2, 2)
    }

    componentDidUpdate( prevProps,  prevState){
        this.fontSizeAdjuster.apply(this.textNode.current)
    }

    componentDidMount(){
        this.fontSizeAdjuster.apply(this.textNode.current)
    }

    render(){
        return (
        <div className="tpl-small-action-container">
            <p className="tpl-small-action" ref={this.textNode}>{this.props.value}</p>
        </div>
        )
    }
}

export default Action;
