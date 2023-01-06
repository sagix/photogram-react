import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import Repository from './data';
import Page from '../Project/Page'

class Project extends Component {
  constructor(props){
      super(props);
      this.repository = Repository.create();
    }

  render(){
      return (
        <div>
          <Helmet>
             <title>Photogram - Try the tool for assistant editors</title>
             <meta name="description" content="Learn and play with our demo data set" />
          </Helmet>
          <Page repository={this.repository} />
        </div>
      );
    }
}

export default Project;
