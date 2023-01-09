import React, { Component } from 'react';
import FontSizeAdjuster from './FontSizeAdjuster'
import './Action.css'
class Action extends Component {

    constructor(props) {
        super(props)
        this.textNode = React.createRef();
        this.fontSizeAdjuster = new FontSizeAdjuster(.2, 2)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value){
            this.fontSizeAdjuster.apply(this.textNode.current)
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.fontSizeAdjuster.apply(this.textNode.current);
        }, 200);
    }

    render() {
        return (
            <div className="action-container">
                <p className="action" ref={this.textNode}>{this.props.value}</p>
            </div>
        )
    }
}

export default Action;
