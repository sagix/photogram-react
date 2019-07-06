import React, { Component } from 'react';
import './Toolbar.css'
import back from './baseline-arrow_back-24px.svg'
import print from './baseline-print-24px.svg'

class Toolbar extends Component{

    render(){
            return (
                <div className="toolbar">
                  <img className={"button button-close"} onClick={event => {window.history.back()}} src={back}/>
                  <h1>{this.props.title}</h1>
                  <img className={"button button-print"}onClick={window.print} src={print}/>

                </div>
            )
        }
}

export default Toolbar;
