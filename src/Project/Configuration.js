import React, { Component } from 'react';
import './Configuration.css'
class Configuration extends Component{

    render(){
            return (
                <div className="configuration">
                    <h1>{this.props.title}</h1>
                    <select onChange={(event) => this.props.onChange( event.target.value)}>
                        <option value="small">Small</option>
                        <option value="large">Large</option>
                    </select>
                    <input id="color-distribution" type="checkBox"
                        onChange={(event) => this.props.onColorDistributionChange( event.target.checked)}/>
                    <label htmlFor="color-distribution">Background color</label>
                </div>
            )
        }
}

export default Configuration;
