import React, { Component } from 'react';

class NewProject extends Component{

    render(){
        return (
            <div>
                <input type="file"
                    webkitdirectory={true.toString()}
                    directory={true.toString()}
                    multiple={true}
                    onChange={(event) => this.props.onNewProject(event.target.files)}/>
            </div>
        )
    }
}

export default NewProject;
