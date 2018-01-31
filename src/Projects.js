import React, { Component } from 'react';
import TemplateFactory from './templates/TemplateFactory'


function Images(props){
    console.log(props);
    let type = props.type
    if(props.files){
        let imageType = /^image\//;
    const image = props.files
    .filter(file => imageType.test(file.type))
    .map((image) => {
        return (
            <TemplateFactory key={image.name} type={type} file={image}/>
        );
    }
    )

    return (
        <div>{image}</div>
    )
}else{
    return null
}
}

function ProjectList(props){
  const project = props.value.map((project) => {
      return (
        <li
           key={project.name}
           onClick={() => props.onDelete(project.key)}
          ><h2>{project.name}</h2>
            <Images files={project.files} type={project.type}/>
          </li>
      );
  }
  )
  return (
    <ul>{project}</ul>
  );
}

class Projects extends Component {

  constructor(props){
    super(props);
    let projectsData = localStorage.getItem('projects');
    let projects;
    if(projectsData === null){
      projects = [];
    }else{
      projects = JSON.parse(projectsData )
    }
    this.state= {
      projects: projects,
      defaultTemplateType: "small",
    };
    this.onChange = this.onChange.bind(this);
  }

  delete(key){
    let projects = this.state.projects.filter((project) => project.key !== key)
    localStorage.setItem('projects', JSON.stringify(projects));
    this.setState( {
      projects :projects
    });
  }

  onChange(event){
    let projects = this.state.projects.slice()
    let index
    if(projects.length === 0){
      index = 0;
    }else{
      index = projects[projects.length -1].key + 1;
    }
    projects.push({
      key: index,
      name: 'Project (' + (index + 1) + ')',
      files: Array.from(event.target.files),
      type: this.state.defaultTemplateType,
    })
    //localStorage.setItem('projects', JSON.stringify(projects));
    this.setState( {
      projects :projects
    });
    console.log(event.target.files);
   }

   onChangeTemplate(event){
       let type = event.target.value;
       let projects = this.state.projects.map(project =>{
           project.type = type
           return project
       })
       this.setState({
           projects: projects,
           defaultTemplateType: type,
       });
   }
  render() {
    return (
      <div>
      <input type="file"
        webkitdirectory={true.toString()}
        directory={true.toString()}
          multiple={true}
          onChange={(event) => this.onChange(event)}/>
          <select onChange={(event) => this.onChangeTemplate(event)}>
          <option value="small">Small</option>
          <option value="large">Large</option>
          </select>
            <ProjectList value={this.state.projects} onDelete={(key) => this.delete(key)}/>
        </div>
    );
  }
}

export default Projects;
