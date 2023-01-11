import React from "react";
import { Link } from "react-router-dom";
import './Card.css';

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
                <div className="picture"><img alt="project cover" src={src} /></div>
                <span>{project.name}</span>
                <button className="btn-delete" onClick={(event) => {
                    event.preventDefault();
                    props.onDeleteProject(project.key);
                }}>&#x2715;</button>
            </Link>
        </li>
    );
}