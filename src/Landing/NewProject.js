import React, { Component } from 'react';
import './NewProject.css'

class NewProject extends Component{

    render(){
        return (
            <form>
                <input type="file" id="new-project-file"
                    webkitdirectory={true.toString()}
                    directory={true.toString()}
                    multiple={true}
                    onChange={(event) => {
                        this.props.onNewProject(event.target.files)
                        event.target.form.reset()
                    }}/>
                <label htmlFor="new-project-file" id="new-project-label">Nouveau projet</label>
            </form>
        )
    }
}

export default NewProject;
