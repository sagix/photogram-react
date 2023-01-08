import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ReactGA from 'react-ga';
import './index.css';
import Header from '../Header';
import NewProject from '../NewProject';
import QuotaProgress from '../QuotaProgress';
import Application from '../Application';
class ListProject extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projects: [],
            quotas: { max: 0, value: 0 }
        }
        this.application = Application.create();
    }

    componentDidMount() {
        this._checkQuotas()
        this.application.list()
            .then((projects) => this.setState({ projects: projects }))

    }

    _checkQuotas() {
        navigator.storage.estimate()
            .then(estimate =>
                this.setState(
                    Object.assign(this.state, {
                        quotas: {
                            max: estimate.quota,
                            value: estimate.usage
                        }
                    })
                )
            );
    }

    onNewProject(files) {
        ReactGA.event({
            category: 'Project',
            action: 'create'
        });
        this.application.add(files)
            .then((projects) => this.setState({ projects: projects }))
            .then(_ => this._checkQuotas())
            .catch(error => console.log(error))
    }

    onDeleteProject(key) {
        ReactGA.event({
            category: 'Project',
            action: 'delete'
        });
        this.application.delete(key)
            .then((projects) => this.setState({ projects: projects }))
            .then(_ => this._checkQuotas())
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="projects-container">
                <Header nav="projects" />
                <NewProject onNewProject={files => this.onNewProject(files)} />
                {this.state.projects.length <= 0
                    ? (<img className="projects-empty" src="/illus/undraw_empty_street_sfxm.svg" alt="No project" />)
                    : null
                }
                <ul id="grid">{this.state.projects.map((project) => {
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
                                    this.onDeleteProject(project.key);
                                }}>&#x2715;</button>
                            </Link>
                        </li>
                    );
                })}</ul>
                <QuotaProgress value={this.state.quotas.value} max={this.state.quotas.max} />
            </div>
        )
    }
}

export default ListProject;
