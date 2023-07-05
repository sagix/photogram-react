import React, { Component } from 'react';
import './Sequence.css'
class Sequence extends Component {

    getContrastYIQ(hexcolor){
        var r = parseInt(hexcolor.substring(1,3),16);
        var g = parseInt(hexcolor.substring(3,5),16);
        var b = parseInt(hexcolor.substring(5,7),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 192) ? 'dark' : 'light';
    }

    render() {
        const color = this.props.color
        return (
            <span className={`sequence ${color ? 'sequence-colored-' + this.getContrastYIQ(color) : ''}`} style={{ 'background': color }}>{this.props.value}</span>
        )
    }
}

export default Sequence;
