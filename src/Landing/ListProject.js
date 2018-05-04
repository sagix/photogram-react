import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './ListProject.css';
class ListProject extends Component{

    render(){
        return (
            <ul id="grid">{this.props.value.map((project) => {
                let img = project.data[0];
                let src
                if(img){
                    src = img.url
                }
                return (
                  <li key={project.name}>
                    <Link to={"/project/" + project.key}>
                        <div className="picture"><img src={src}/></div>
                        <span>{project.name}</span>
                        <button className="btn-delete" onClick={(event) => {
                            event.preventDefault()
                            this.props.onDelete(project.key)
                        }}>&#x2715;</button>
                    </Link>
                  </li>
                );
            })}</ul>
        )
    }
}

export default ListProject;
