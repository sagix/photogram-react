import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import Application from '../Application';
import ProjectsDataSource from '../Application/ProjectsDataSource';
import Page from '../Project/Page'
import Csv from '../FilesParser/Csv';

class Project extends Component {
  constructor(props) {
    super(props);
    this.application = Application.create();
    this.state = {};
  }

  async componentDidMount() {
    const csv = await this.createDataCsv();
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
    this.setState({
      application: Application.createNull({
        dataSource: ProjectsDataSource.createNull({ projects: [project] })
      })
    })
  }

  async createDataCsv() {
    let response = await fetch(new URL("demo/data.csv", new URL(window.location.href)));
    let data = await response.blob();
    let metadata = {
      type: 'text/csv'
    };
    return new File([data], "data.csv", metadata);
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Photogram - Try the tool for assistant editors</title>
          <meta name="description" content="Learn and play with our demo data set" />
        </Helmet>
        {this.state.application
          ? <Page application={this.state.application} id="demo" />
          : <div />}
      </div>
    );
  }
}

export default Project;
