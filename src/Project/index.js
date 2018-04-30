import React, { Component } from 'react';
import Repository from '../Data';
import Configuration from './Configuration'
import Tiles from './Tiles'
class Project extends Component{
    constructor(props){
      super(props);
      this.repository = new Repository()
      this.state= {
        project: {},
        template: "small"
      };
    }

    componentDidMount(){
        this.repository.get(this.props.match.params.id)
        .then((project) => {
            console.log(project);
            this.setState(Object.assign(this.state, {project: project}))
        }).catch(e => console.log(e))
    }

    render(){
        return (
            <div>
                <Configuration onChange={type =>
                    this.setState(Object.assign(this.state, {template: type}))
                }/>
                <Tiles value={this.state.project.files} type={this.state.template}/>
            </div>
        )
    }
}

export default Project;
