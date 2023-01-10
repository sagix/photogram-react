import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import Application from '../Application';
import ProjectsDataSource from '../Application/ProjectsDataSource';
import Page from '../Project/Page'
import Csv from '../FilesParser/Csv';


export default function Project() {

  const history = useHistory();
  const [ application, setApplication ] = useState(undefined);

  useEffect(() => {
    async function createApplication() {
      const csv = await createDataCsv();
      const data = await new Csv().execute([csv]);
      const base = new URL(window.location.href);
      data.map(d => {
        return Object.assign(d, {
          url: new URL(`/demo/${d.id}.jpg`, base)
        })
      })
      const project = {
        key: "demo",
        name: "Le fardeau (démo)",
        data: data,
        colors: {},
        template: "small",
      }
      return Application.createNull({
        dataSource: ProjectsDataSource.createNull({ projects: [project] })
      });
    }
    createApplication().then(app => setApplication(app)).catch(err => console.error(err));
  });

  async function createDataCsv() {
    let response = await fetch(new URL("demo/data.csv", new URL(window.location.href)));
    let data = await response.blob();
    let metadata = {
      type: 'text/csv'
    };
    return new File([data], "data.csv", metadata);
  }

  return (
    <div>
      <Helmet>
        <title>Photogram - Try the tool for assistant editors</title>
        <meta name="description" content="Learn and play with our demo data set" />
      </Helmet>
      {application
        ? <Page application={application} id="demo" onBack={() => history.goBack()} />
        : <div />}
    </div>
  );
}

