import React, { Component } from 'react';

function ProjectList(props){
  const project = props.value.map((project) => {
      return (
        <li
           key={project.name}
           onClick={() => props.onDelete(project.key)}
          >{project.name}</li>
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
    })
    localStorage.setItem('projects', JSON.stringify(projects));
    this.setState( {
      projects :projects
    });
    console.log(event.target.files);
   }
  render() {
    return (
      <div>
      <input type="file"
        webkitdirectory={true.toString()}
        directory={true.toString()}
          multiple={true}
          onChange={(event) => this.onChange(event)}/>
            <ProjectList value={this.state.projects} onDelete={(key) => this.delete(key)}/>
        </div>
    );
  }
}

export default Projects;
