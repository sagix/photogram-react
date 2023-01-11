import React, { Component } from 'react';
import './ListProject.css';
import ImportProject from '../ImportProject';
import Card from '../Projects/Card';
class ListProject extends Component {

    render() {
        return (
            <div className="list-project">
                <div className="list-project-header">
                    <h2>Projects</h2>
                    <ImportProject onProject={files => this.props.onImportProject(files)} />
                </div>
                <div className="list-project-container">
                    <ul id="grid">{this.props.value.map((project) => {
                        return (<Card key={project.key} project={project} onDeleteProject={key => this.props.onDeleteProject(key)} />);
                    })}</ul>
                </div>
            </div>
        )
    }
}

export default ListProject;
