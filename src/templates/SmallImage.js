import React, { Component } from 'react';
import '../styles.css'
import './small.css';
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
                <div className="tpl-small-ele">
        <img className="tpl-small-img" src={this.state.src} />
        <div className="tpl-small-legend">
            <div className="tpl-small-indicators">
                <span className="tpl-small-sequence"></span>
                <img className="tpl-small-dot tpl-small-periode" />
                <img className="tpl-small-dot dot-green fx" />
            </div>
            <div className="tpl-small-action-container">
                <p className="tpl-small-action"></p>
            </div>
        </div>
    </div>
            )
        }
}

export default SmallImage;
