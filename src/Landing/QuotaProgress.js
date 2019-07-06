import React, { Component } from 'react';
import './QuotaProgress.css'

class QuotaProgress extends Component{

    humanFileSize(size) {
        var i = size === 0 ? 0 :Math.floor( Math.log(size) / Math.log(1024) );
        return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    };

    render(){
        return (
            <div className="quota-progress-container">
                <span>Disk space usage:</span>
                <progress max={this.props.max} value={this.props.value}/>
                <em>{this.humanFileSize(this.props.value)} / {this.humanFileSize(this.props.max)}</em>
            </div>
        )
    }
}

export default QuotaProgress;
