import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './ListProject.css';
class ListProject extends Component{

    render(){
        return (
            <ul id="grid">{this.props.value.map((project) => {
                let src;
                if(project.mainPicture){
                    src = project.mainPicture;
                } else if(project.data[0]){
                    src = project.data[0].url;
                }
                return (
                  <li key={project.key}>
                    <Link to={"/project/" + project.key}>
                        <div className="picture"><img alt="project cover" src={src}/></div>
                        <span>{project.name}</span>
                        <button className="btn-delete" onClick={(event) => {
                            event.preventDefault();
                            this.props.onDelete(project.key);
                        }}>&#x2715;</button>
                    </Link>
                  </li>
                );
            })}</ul>
        )
    }
}

export default ListProject;
