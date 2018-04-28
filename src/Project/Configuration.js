import React, { Component } from 'react';
class Configuration extends Component{
    
    render(){
            return (
                <div>
                    <select onChange={(event) => this.props.onChange( event.target.value)}>
                    <option value="small">Small</option>
                    <option value="large">Large</option>
                    </select>
                </div>
            )
        }
}

export default Configuration;
