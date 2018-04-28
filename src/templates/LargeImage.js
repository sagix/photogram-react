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
    reader.readAsArrayBuffer(props.file)
}
onload(event){
    let hearders = new Headers()
    hearders.append("Content-Type", this.props.file.type)
    hearders.append("Content-Length", this.props.file.size)
    caches.open('image-cache')
    .then( cache => {
        let h = new Headers()
        h.append("Content-Type", this.props.file.type)
        cache.put(
            new Request('/images/'+ this.props.file.name),
            new Response(event.target.result, {
            	status: 200,
            	statusText: "From Cache",
            	headers: h
        }))
    }).then(_ =>{
        this.setState( {
        src: '/images/'+ this.props.file.name
        })
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
