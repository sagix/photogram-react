import React, { Component } from 'react';
import './index.css';

class ImportButton extends Component{
	render() {
		return (
			<form className="import-button-form">
                <input type="file" id="import-button"
                	className="import-button-input"
                    webkitdirectory={true.toString()}
                    directory={true.toString()}
                    multiple={true}
                    onChange={(event) => {
                        this.props.onFiles(event.target.files)
                        event.target.form.reset()
                    }}/>
                <label htmlFor="import-button" className="import-button-label">{this.props.children}</label>	
            </form>
		)
	}
}


export default ImportButton;