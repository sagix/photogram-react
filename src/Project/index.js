import React, { Component } from 'react';
import Repository from '../Data';
import Page from './Page'

class Project extends Component {
  constructor(props) {
    super(props);
    this.repository = new Repository()
  }

  render() {
    return (
      <Page repository={this.repository} id={this.props.match.params.id} />
    );
  }
}

export default Project;
