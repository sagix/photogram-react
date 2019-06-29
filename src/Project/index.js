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
            if(project.template === undefined){
                project.template = "small"
            }
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
                <div className="layout-left">
                    <Tiles
                        colorDistribution={this.state.color_distribution}
                        colors={this.state.project.colors}
                        value={this.state.project.data}
                        type={this.state.project.template}
                        fontFamily={this.state.project.fontFamily}
                        onTile={data => this.setState(Object.assign(this.state, {data: data}))}/>
                </div>

                    <Configuration
                        title={this.state.project.name}
                        colors={this.state.project.colors}
                        template={this.state.project.template}
                        fontFamily={this.state.project.fontFamily}
                        onChange={template => this.repository.updateTemplate(this.props.match.params.id, template).then(() => this.loadData())}
                        onColorChange={color => this.repository.updateColor(this.props.match.params.id, color).then(() => this.loadData())}
                        onColorDistributionChange={full => this.setState(Object.assign(this.state, {color_distribution: full}))}
                        onFontFamilyChange={fontFamily => this.repository.updateFontFamily(this.props.match.params.id, fontFamily).then(() => this.loadData())}
                    />
                </div>
            </div>
        )
    }
}

export default Project;
