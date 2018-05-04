import React, { Component } from 'react';
import Header from './Header';
import NewProject from './NewProject';
import ListProject from './ListProject';
import QuotaProgress from './QuotaProgress';
import Repository from '../Data';
import '../styles.css'

class Landing extends Component{
    constructor(props){
        super(props)
        this.state ={
            projects:[],
            quotas:{max: 0, value: 0}
        }
        this.repository = new Repository()
    }

    componentDidMount(){
        this._checkQuotas()
        this.repository.list()
        .then((projects) => this.setState({projects: projects}))

    }

    _checkQuotas(){
        navigator.storage.estimate()
        .then(estimate =>
            this.setState(
                Object.assign(this.state, {quotas: {
                    max: estimate.quota,
                    value: estimate.usage
                }})
            )
        );
    }

    onNewProject(files){
        this.repository.add(files)
        .then((projects) => this.setState({projects: projects}))
        .then(_ => this._checkQuotas())
        .catch(error => console.log(error))
    }

    onDeleteProject(key){
        this.repository.delete(key)
        .then((projects) => this.setState({projects: projects}))
        .then(_ => this._checkQuotas())
        .catch(error => console.log(error))
    }

    render(){
            return (
                <div>
                    <Header/>
                    <QuotaProgress value={this.state.quotas.value} max={this.state.quotas.max}/>
                    <NewProject onNewProject={files => this.onNewProject(files)} />
                    <ListProject value={this.state.projects} onDelete={(key) => this.onDeleteProject(key)}/>
                </div>
            )
        }
}

export default Landing;
