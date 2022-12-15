import React from 'react';
import './index.css';

function ImportButton(props) {
    return (
        <form className="import-button-form">
            <input type="file" id="import-button"
                className="import-button-input"
                webkitdirectory={true.toString()}
                directory={true.toString()}
                multiple={true}
                onChange={(event) => {
                    props.onFiles(event.target.files)
                    event.target.form.reset()
                }} />
            <label htmlFor="import-button" className="import-button-label">{props.children}</label>
        </form>
    )
}


export default ImportButton;