import React, { Component } from 'react';
import './Configuration.css'
import Colors from './Colors'
import LargeImage from '../Templates/Large'
import SmallImage from '../Templates/Small'
import ColorWrapper from './ColorWrapper';

class Configuration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontFamily: props.fontFamily || ""
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.fontFamily !== prevProps.fontFamily) {
            this.setState(Object.assign(this.state, {
                fontFamily: this.props.fontFamily
            }));
        }
    }

    onPrintSpaceAroundChange = (event) => {
        event.preventDefault();
        this.props.onPrintSpaceAroundChange(event.target.checked);
    }

    onFontFamilyChange = (event) => {
        event.preventDefault();
        this.props.onFontFamilyChange(event.target.value);
    }

    render() {
        return (
            <div className="configuration">
                <section>
                    <h2>Print options</h2>
                    <div className="labels" >
                        <form onSubmit={(event) => { event.preventDefault(); }}>
                            <input id="print-space-around" type="checkbox" list="font-list"
                                onChange={this.onPrintSpaceAroundChange}
                                checked={this.props.printSpaceAround === undefined ? true : this.props.printSpaceAround}
                            />
                            <label htmlFor="print-space-around">Space around cards</label>
                        </form>
                    </div>
                </section>
                <section>
                    <h2>Font</h2>
                    <form onSubmit={(event) => { event.preventDefault(); }}>
                        <input id="font-family" type="text" list="font-list"
                            onChange={this.onFontFamilyChange}
                            value={this.state.fontFamily}
                        />
                        <datalist id="font-list">
                            {[
                                "Arial",
                                "Arial Black",
                                "Book Antiqua",
                                "Charcoal",
                                "Comic Sans MS",
                                "Courier New",
                                "Courier",
                                "Gadget",
                                "Geneva",
                                "Georgia",
                                "Impact",
                                "Helvetica",
                                "Lucida Grande",
                                "Lucida Sans Unicode",
                                "Lucida Console",
                                "Monaco",
                                "Palatino",
                                "Palatino Linotype",
                                "Tahoma",
                                "Times New Roman",
                                "Times",
                                "Trebuchet MS",
                                "Verdana",
                                "cursive",
                                "monospace",
                                "serif",
                                "sans-serif",
                            ].map(p =>
                                <option key={p} value={p} />
                            )}
                        </datalist>
                    </form>
                </section>
                <section>
                    <h2>Template</h2>
                    <form className="template">
                        <input type="radio" name="layout" id="layout_small" value="small"
                            checked={this.props.template === "small"}
                            onChange={(event) => this.props.onChange(event.target.value)} />
                        <label htmlFor="layout_small" className="preview">
                            <i>Small</i>
                            <br />
                            <SmallImage
                                file="{sequence, action, periode, fx, url, color, colorDistribution, onTile}"
                                onTile={() => { }}
                            />
                        </label>
                        <input type="radio" name="layout" id="layout_large" value="large"
                            checked={this.props.template === "large"}
                            onChange={(event) => this.props.onChange(event.target.value)} />
                        <label htmlFor="layout_large" className="preview">
                            <i>Large</i>
                            <br />
                            <LargeImage
                                file="{sequence, action, periode, fx, url, color, colorDistribution}"
                                onTile={() => { }}
                            />

                        </label>
                    </form>
                </section>

                <section>
                    <h2>Labels</h2>
                    <div className="labels" >
                        <input id="color-distribution" type="checkBox"
                            onChange={(event) =>
                                this.props.onColorDistributionChange(event.target.checked ? "card" : "indicator")
                            } />
                        <label htmlFor="color-distribution">Background color</label>
                    </div>
                    <table className="labels" >
                        <tbody>
                            <tr>
                                <td><ColorWrapper
                                    color={this.props.defaultColor || '#FFFFFF'}
                                    onChangeComplete={(color, event) => {
                                        this.props.onDefaultColorChange(color.hex)
                                    }}
                                /></td>
                                <td>Default</td>
                            </tr>
                        </tbody>
                    </table>
                    <Colors className="labels"
                        colors={this.props.colors}
                        onColorChange={this.props.onColorChange}
                        onDelete={this.props.onDeleteColor}
                    />
                </section>
            </div>
        )
    }
}

export default Configuration;
