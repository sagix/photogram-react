import React from 'react';
import { useHistory } from "react-router-dom";
import Application from '../Application';
import Page from './Page'

export default function Project(props) {
  const application = Application.create();
  const history = useHistory();

  return (
    <Page application={application} onBack={() => history.goBack()} id={props.match.params.id} />
  );
}
