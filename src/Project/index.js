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
            this.setState(Object.assign(this.state, {project: project}))
        }).catch(e => console.log(e))
    }

    render(){
        return (
            <div>
                <Configuration
                    title={this.state.project.name}
                    onChange={type => this.setState(Object.assign(this.state, {template: type}))}
                    onColorDistributionChange={full => this.setState(Object.assign(this.state, {color_distribution: full}))}
                />
                <Tiles
                    colorDistribution={this.state.color_distribution}
                    colors={this.state.project.colors}
                    value={this.state.project.data}
                    type={this.state.template}/>
            </div>
        )
    }
}

export default Project;
