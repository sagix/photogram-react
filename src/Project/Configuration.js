import React, { Component } from 'react';
import './Configuration.css'
import Colors from './Colors'
import LargeImage from '../Templates/Large'
import SmallImage from '../Templates/Small'

class Configuration extends Component{

    render(){
            return (
                <div className="configuration">
                    <h1>{this.props.title}</h1>
                    <section>
                        <h2>Layout</h2>
                        <form className="template">
                        <input type="radio" name="layout" id="layout_small" value="small"
                         checked={this.props.template === "small"}
                         onChange={(event) => this.props.onChange( event.target.value)} />
                        <label htmlFor="layout_small" className="preview">
                            <i>Small</i>
                            <br/>
                            <SmallImage
                                file="{sequence, action, periode, fx, url, color, colorDistribution, onTile}"
                                onTile={()=>{}}
                            />
                        </label>
                        <input type="radio" name="layout" id="layout_large" value="large"
                        checked={this.props.template === "large"}
                        onChange={(event) => this.props.onChange( event.target.value)} />
                        <label htmlFor="layout_large"  className="preview">
                            <i>Large</i>
                            <br/>
                            <LargeImage
                                file="{sequence, action, periode, fx, url, color, colorDistribution}"
                                onTile={()=>{}}
                            />

                        </label>
                        </form>
                    </section>

                    <section>
                        <h2>Colors</h2>
                        <div className="colors" >
                            <input id="color-distribution" type="checkBox"
                            onChange={(event) => this.props.onColorDistributionChange( event.target.checked)}/>
                            <label htmlFor="color-distribution">Background color</label>
                        </div>
                        <Colors className="colors" colors={this.props.colors} onColorChange={ this.props.onColorChange }/>
                    </section>
                </div>
            )
        }
}

export default Configuration;
