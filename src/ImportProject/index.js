import React, { Component } from 'react';
import './index.css'

class ImportProject extends Component {

    render() {
        return (
            <form className="import-project">
                <input type="file" id="import-project-file"
                    webkitdirectory={true.toString()}
                    directory={true.toString()}
                    multiple={true}
                    onChange={(event) => {
                        this.props.onProject(event.target.files)
                        event.target.form.reset()
                    }} />
                <label htmlFor="import-project-file" id="import-project-label">Import project</label>
            </form>
        )
    }
}

export default ImportProject;
