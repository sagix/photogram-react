import React, { Component } from 'react';
import './index.css'

class NewProject extends Component{

    render(){
        return (
            <form className="new-project">
                <input type="file" id="new-project-file"
                    webkitdirectory={true.toString()}
                    directory={true.toString()}
                    multiple={true}
                    onChange={(event) => {
                        this.props.onNewProject(event.target.files)
                        event.target.form.reset()
                    }}/>
                <label htmlFor="new-project-file" id="new-project-label">New project</label>
            </form>
        )
    }
}

export default NewProject;
