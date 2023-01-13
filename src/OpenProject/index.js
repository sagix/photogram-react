import React from 'react';
import './index.css'

export default function OpenProject(props) {

    async function handleDir(event) {
        event.preventDefault();
        const dirHandle = await window.showDirectoryPicker({
            id: "photogram-projects",
            mode: "readwrite",
            startIn: "pictures",
        });
        props.onProject(dirHandle);
    }

    return (
        <div className="open-project">
            <label id="open-project-label" onClick={handleDir}>Open project</label>
        </div>
    );
}
