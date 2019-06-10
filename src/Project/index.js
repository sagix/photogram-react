import React, { Component } from 'react';
import Repository from '../Data';
import Configuration from './Configuration'
import Tiles from './Tiles'
import Form from './Form'
import '../styles.css'
import './index.css'

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
        this.loadData()
    }

    loadData(){
        this.repository.get(this.props.match.params.id)
        .then((project) => {
            this.setState(Object.assign(this.state, {project: project}))
        }).catch(e => console.log(e))
    }

    render(){
        return (
            <div>
                <Form
                    data={this.state.data}
                    colors={this.state.project.colors}
                    onCancel={() => this.setState(Object.assign(this.state, {data: undefined}))}
                    onSave={data => this.repository.update(this.props.match.params.id, data).then(() => this.loadData())}
                />
                <div className="layout-parent">
                    <Tiles
                        className="layout-left"
                        colorDistribution={this.state.color_distribution}
                        colors={this.state.project.colors}
                        value={this.state.project.data}
                        type={this.state.template}
                        onTile={data => this.setState(Object.assign(this.state, {data: data}))}/>

                    <Configuration
                        title={this.state.project.name}
                        colors={this.state.project.colors}
                        template={this.state.template}
                        onChange={type => this.setState(Object.assign(this.state, {template: type}))}
                        onColorChange={color => this.repository.updateColor(this.props.match.params.id, color).then(() => this.loadData())}
                        onColorDistributionChange={full => this.setState(Object.assign(this.state, {color_distribution: full}))}
                    />
                </div>
            </div>
        )
    }
}

export default Project;
