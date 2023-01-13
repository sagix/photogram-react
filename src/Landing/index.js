import React, { useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import Header from '../Header';
import Creators from './Creators';
import EmptyProject from './EmptyProject';
import ListProject from './ListProject';
import QuotaProgress from '../QuotaProgress';
import Application from '../Application';
import '../styles.css'
import './index.css';
import { useHistory } from 'react-router-dom';

export default function Landing() {

    const application = useMemo(() => Application.create(), []);
    const history = useHistory();

    const [projects, setProjects] = useState([])
    const [quotas, setQuotas] = useState({ max: 0, value: 0 });

    useEffect(() => {
        _checkQuotas()
        application.list().then((projects) => setProjects(projects))
    }, [application]);

    function _checkQuotas() {
        navigator.storage.estimate().then(estimate =>
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
            console.log(key);
            console.log("caca");
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
        <div className="landing-container">
            <Header />
            {projects.length <= 0
                ? null
                : (
                    <div>
                        <ListProject value={projects}
                            onDeleteProject={(key) => onDeleteProject(key)}
                            onImportProject={files => onImportProject(files)}
                            onLinkProject={(key) => onLinkProject(key)} />
                    </div>
                )
            }
            <EmptyProject onImportProject={files => onImportProject(files)} />
            <QuotaProgress value={quotas.value} max={quotas.max} />
            <Creators />
        </div>
    )
}
