import React, { Component } from 'react';
import './Configuration.css'
import Colors from './Colors'

class Configuration extends Component{

    render(){
            return (
                <div className="configuration">
                    <h1>{this.props.title}</h1>
                    <section>
                        <h2>Layout</h2>
                        <select onChange={(event) => this.props.onChange( event.target.value)}>
                            <option value="small">Small</option>
                            <option value="large">Large</option>
                        </select>
                    </section>

                    <section>
                        <h2>Colors</h2>
                        <div style={{
                            marginTop:8,
                            marginBottom:8,
                        }}>
                            <input id="color-distribution" type="checkBox"
                            onChange={(event) => this.props.onColorDistributionChange( event.target.checked)}/>
                            <label htmlFor="color-distribution">Background color</label>
                        </div>
                        <Colors colors={this.props.colors} onColorChange={ this.props.onColorChange }/>
                    </section>
                </div>
            )
        }
}

export default Configuration;
