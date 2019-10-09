import React, { Component } from 'react';
import Repository from './data';
import Page from '../Project/Page'

class Project extends Component {
  constructor(props){
      super(props);
      this.repository = new Repository()
    }

  render(){
      return (
          <Page repository={this.repository}/>
      );
    }
}

export default Project;
