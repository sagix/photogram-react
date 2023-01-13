import React, { useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import './index.css';
import { useHistory } from "react-router-dom";
import Header from '../Header';
import ImportProject from '../ImportProject';
import QuotaProgress from '../QuotaProgress';
import Application from '../Application';
import Card from './Card';
import OpenProject from '../OpenProject';

function ListProject() {


    const application = useMemo(() => Application.create(), []);
    const history = useHistory();

    const [projects, setProjects] = useState([])
    const [quotas, setQuotas] = useState({ max: 0, value: 0 });

    useEffect(() => {
        _checkQuotas()
        application.list().then((projects) => setProjects(projects))
    }, [application])

    function _checkQuotas() {
        navigator.storage.estimate()
            .then(estimate =>
                setQuotas({
                    max: estimate.quota,
                    value: estimate.usage
                })
            );
    }

    function onImportProject(files) {
        ReactGA.event({
            category: 'Project',
            action: 'create'
        });
        application.add(files)
            .then((projects) => setProjects(projects))
            .then(_ => _checkQuotas())
            .catch(error => console.log(error))
    }

    function onOpenProject(dirHandle) {
        ReactGA.event({
            category: 'Project',
            action: 'create'
        });
        application.open(dirHandle)
            .then((projects) => setProjects(projects))
            .then(_ => _checkQuotas())
            .catch(error => console.log(error))
    }

    function onDeleteProject(key) {
        ReactGA.event({
            category: 'Project',
            action: 'delete'
        });
        application.delete(key)
            .then((projects) => setProjects(projects))
            .then(_ => _checkQuotas())
            .catch(error => console.log(error))
    }

    async function onLinkProject(key) {
        try {
            const needsPermission = await application.needsPermission(key);
            if (needsPermission) {
                await application.requestPermission(key);
            }
            history.push(`/project/${key}`);
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="projects-container">
            <Header nav="projects" />
            <div className='action-project'>
                <ImportProject onProject={files => onImportProject(files)} />
                <OpenProject onProject={dirHandle => onOpenProject(dirHandle)} />
            </div>
            {projects.length <= 0
                ? (<img className="projects-empty" src="/illus/undraw_empty_street_sfxm.svg" alt="No project" />)
                : null
            }
            <ul id="grid">{projects.map((project) => {
                return (<Card key={project.key}
                    project={project}
                    onDeleteProject={key => onDeleteProject(key)}
                    onLinkProject={key => onLinkProject(key)}
                />)
            })}</ul>
            <QuotaProgress value={quotas.value} max={quotas.max} />
        </div>
    )
}

export default ListProject;
