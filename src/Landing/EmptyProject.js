import React, { Component } from 'react';
import './EmptyProject.css';

class EmptyCell extends Component {
  render(){
    return(
      <section className={this.props.className}>
        <img src={this.props.src} alt=""/>
        <h1>{this.props.title}</h1>
        <span>{this.props.desc}</span>
      </section>
    )
  }
}


class EmptyProject  extends Component{
  render(){
      return (
        <div className="empty-project-layout">
          <a href="/tutorial">
            <EmptyCell className="empty-project-item"
              src="illus/undraw_learning_2q1h.svg"
              title="Learn"
              desc="Read our tutorial to learn how to create a new project"
              />
          </a>
          <form>
              <input type="file" id="new-project-file"
                  webkitdirectory={true.toString()}
                  directory={true.toString()}
                  multiple={true}
                  onChange={(event) => {
                      this.props.onNewProject(event.target.files)
                      event.target.form.reset()
                  }}/>
              <label htmlFor="new-project-file">
                <EmptyCell className="empty-project-item"
                  src="/illus/undraw_upload_image_iwej.svg"
                  title="Create"
                  desc="Import your pictures and csv file"
                  />
              </label>
          </form>
          <a href="/project-demo">
          <EmptyCell className="empty-project-item"
            src="/illus/undraw_Presentation_62e1.svg"
            title="Try"
            desc="See a live demo of Photogram"
            />
            </a>
        </div>
      )
  }
}

export default EmptyProject
