import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './ListProject.css';
import NewProject from '../NewProject';
class ListProject extends Component {

    render() {
        return (
            <div className="list-project">
                <div className="list-project-header">
                    <h2>Projects</h2>
                    <NewProject onNewProject={files => this.props.onNewProject(files)} />
                </div>
                <div className="list-project-container">
                    <ul id="grid">{this.props.value.map((project) => {
                        let src;
                        if (project.mainPicture) {
                            src = project.mainPicture;
                        } else if (project.data[0]) {
                            src = project.data[0].url;
                        }
                        return (
                            <li key={project.key}>
                                <Link to={"/project/" + project.key}>
                                    <div className="picture"><img alt="project cover" src={src} /></div>
                                    <span>{project.name}</span>
                                    <button className="btn-delete" onClick={(event) => {
                                        event.preventDefault();
                                        this.props.onDelete(project.key);
                                    }}>&#x2715;</button>
                                </Link>
                            </li>
                        );
                    })}</ul>
                </div>
            </div>
        )
    }
}

export default ListProject;
