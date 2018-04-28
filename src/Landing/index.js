import React, { Component } from 'react';
import Header from './Header';
import NewProject from './NewProject';
import ListProject from './ListProject';
import Repository from '../Project/Repository';

class Landing extends Component{
    constructor(props){
        super(props)
        this.state ={
            projects:[]
        }
        this.repository = new Repository()
    }

    componentDidMount(){
        this.repository.list()
        .then((projects) => this.setState({projects: projects}))
    }

    onNewProject(files){
        this.repository.add(files)
        .then((projects) => this.setState({projects: projects}))
    }

    render(){
            return (
                <div>
                    <Header/>
                    <NewProject onNewProject={files => this.onNewProject(files)} />
                    <ListProject value={this.state.projects}/>
                </div>
            )
        }
}

export default Landing;
