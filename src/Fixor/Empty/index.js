import React from 'react';
import ImportButton from '../ImportButton'
import './index.css';

function Empty(props) {
  return (
    <div className="fixor-empty-container">
      <header className="header-container">
        <a className="header-text" href="/fixor">
          <h1 className="App-title">Fixor</h1>
          <p>A tool for assistant editor</p>
        </a>
      </header>
      <div className="empty-button">
        <ImportButton onFiles={props.onFiles}>Add first project</ImportButton>
      </div>
      <img className="projects-empty" src="/illus/undraw_empty_street_sfxm.svg" alt="No project" />
    </div>
  );
}


export default Empty;
