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
                <div className="tpl-large-ele">
                    <div className="tpl-large-img-container">
                        <img className="tpl-large-img" src={this.state.src} />
                    </div>
                    <div className="tpl-large-legend">
                        <div className="tpl-large-indicators">
                            <span className="tpl-large-sequence"></span>
                            <img className="tpl-large-dot tpl-large-periode" />
                            <img className="tpl-large-dot dot-green fx" />
                        </div>
                        <div className="tpl-large-action-container">
                            <p className="tpl-large-action"></p>
                        </div>
                    </div>
                </div>
            )
        }
}

export default SmallImage;
