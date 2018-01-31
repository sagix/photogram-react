import React, { Component } from 'react';
import '../styles.css'
import './large.css';
class SmallImage extends Component{
constructor(props){
    super(props);
    this.state={
        src: null,
    }
    let reader = new FileReader()
    reader.onload = (e) => this.onload(e)
    reader.readAsDataURL(props.file)
}
onload(event){
    this.setState( {
    src: event.target.result
    })
}
        render(){
            return (
                <div className="ele tpl-large">
        <img className="img" src={this.state.src} />
        <div className="legend">
            <div className="indicators">
                <span className="sequence"></span>
                <img className="dot periode" />
                <img className="dot dot-green fx" />
            </div>
            <div className="action-container">
                <p className="action"></p>
            </div>
        </div>
    </div>
            )
        }
}

export default SmallImage;
