import React from "react";
import { Link } from "react-router-dom";
import './Card.css';
import iconLinkOn from './link_on.svg';
import iconLinkOff from './link_off.svg';

export default function Card(props) {
    const project = props.project;
    let src;
    if (project.mainPicture) {
        src = project.mainPicture;
    } else if (project.data[0]) {
        src = project.data[0].url;
    }
    return (
        <li className="projects-card">
            <Link to={"/project/" + project.key}>
                <div className="img-project-container">
                    <img className="img-project-cover" alt="project cover" src={src} />
                    <LinkIcon linked={project.dirLink !== undefined} />
                </div>
                <span>{project.name}</span>
                <button className="btn-delete" onClick={(event) => {
                    event.preventDefault();
                    props.onDeleteProject(project.key);
                }}>&#x2715;</button>
            </Link>
        </li>
    );
}

function LinkIcon(props) {
    return (
        <img className="img-project-link"
            src={props.linked ? iconLinkOn : iconLinkOff}
            alt=""
            title={props.linked ? "Linked project with file system" : "Imported project inside the browser (unlinked)"}
        />
    );
}