import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Header from '../Header';
import Creators from './Creators';
import EmptyProject from './EmptyProject';
import ListProject from './ListProject';
import QuotaProgress from '../QuotaProgress';
import Repository from '../Repository';
import '../styles.css'
import './index.css';

class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projects: [],
            quotas: { max: 0, value: 0 }
        }
        this.repository = Repository.create();
    }

    componentDidMount() {
        this._checkQuotas()
        this.repository.list()
            .then((projects) => this.setState({ projects: projects }))

    }

    _checkQuotas() {
        navigator.storage.estimate().then(estimate =>
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
        this.repository.add(files)
            .then((projects) => this.setState({ projects: projects }))
            .then(_ => this._checkQuotas())
            .catch(error => console.log(error))
    }

    onDeleteProject(key) {
        ReactGA.event({
            category: 'Project',
            action: 'delete'
        });
        this.repository.delete(key)
            .then((projects) => this.setState({ projects: projects }))
            .then(_ => this._checkQuotas())
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="landing-container">
                <Header />
                {this.state.projects.length <= 0
                    ? null
                    : (
                        <div>
                            <ListProject value={this.state.projects}
                                onDelete={(key) => this.onDeleteProject(key)}
                                onNewProject={files => this.onNewProject(files)} />
                        </div>
                    )
                }
                <EmptyProject onNewProject={files => this.onNewProject(files)} />
                <QuotaProgress value={this.state.quotas.value} max={this.state.quotas.max} />
                <Creators />
            </div>
        )
    }
}

export default Landing;
