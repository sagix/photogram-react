import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Image from '../Data/images';
import Toolbar from './Toolbar'
import Configuration from './Configuration'
import Tiles from './Tiles'
import Form from './Form'
import '../styles.css'
import './Page.css'

class Page extends Component{
    constructor(props){
      super(props);
      this.repository = props.repository
      this.state= {
        project: {},
        template: "small"
      };
    }

    componentDidMount(){
        this.loadData()
    }

    loadData(){
        this.repository.get(this.props.id)
        .then((project) => {
            if(project.template === undefined){
                project.template = "small"
            }
            this.setState(Object.assign(this.state, {project: project}))
        }).catch(e => console.log(e))
    }

    back(){
      ReactGA.event({
        category: 'Project',
        action: 'back'
      });
      window.history.back();
    }

    print(){
      let projectSize = this.state.project.data.length;
      ReactGA.event({
        category: 'Project',
        action: 'print',
        value: projectSize
      });
      window.print();
    }

    render(){
        return (
            <div>
                <Form
                    data={this.state.data}
                    colors={this.state.project.colors}
                    onCancel={() => this.setState(Object.assign(this.state, {data: undefined}))}
                    onSave={data => this.repository.update(this.props.id, data).then(() => this.loadData())}
                    onNewImage={file => {
                      new Image(this.props.id).execute(file).then((result) => {
                          this.setState(Object.assign(this.state,
                            Object.assign(this.state.data, {url: result[0].url}))
                          )
                      })
                    }}
                    onDeleteImage={()=>{
                      this.setState(Object.assign(this.state,
                        Object.assign(this.state.data, {url: null}))
                      )
                    }
                    }
                    setAsMain={url => {
                      this.repository.updateMainPicture(this.props.id, url)
                      this.setState(Object.assign(this.state, {data: undefined}))
                    }}
                />
                <div className="layout-parent">
                  <div className="layout-top">
                    <Toolbar
                      title={this.state.project.name}
                      onPrint={() => this.print()}
                      onBack={() => this.back()}/>
                  </div>
                  <div className="layout-left">
                      <Tiles
                          colorDistribution={this.state.color_distribution}
                          colors={this.state.project.colors}
                          value={this.state.project.data}
                          type={this.state.project.template}
                          fontFamily={this.state.project.fontFamily}
                          onTile={data => this.setState(Object.assign(this.state, {data: data}))}/>
                  </div>
                  <div className="layout-right">
                      <Configuration
                          colors={this.state.project.colors}
                          template={this.state.project.template}
                          fontFamily={this.state.project.fontFamily}
                          onChange={template => this.repository.updateTemplate(this.props.id, template).then(() => this.loadData())}
                          onColorChange={color => this.repository.updateColor(this.props.id, color).then(() => this.loadData())}
                          onDeleteColor={key => this.repository.deleteColor(this.props.id, key).then(() => this.loadData())}
                          onColorDistributionChange={full => this.setState(Object.assign(this.state, {color_distribution: full}))}
                          onFontFamilyChange={fontFamily => this.repository.updateFontFamily(this.props.id, fontFamily).then(() => this.loadData())}
                      />
                  </div>
                </div>
            </div>
        )
    }
}

export default Page;
