import React, { Component } from 'react';

class QuotaProgress extends Component{

    render(){
        return (
            <progress max={this.props.max} value={this.props.value}/>
        )
    }
}

export default QuotaProgress;
