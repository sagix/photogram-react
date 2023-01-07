import React from 'react';
import { useHistory } from "react-router-dom";
import Repository from '../Repository';
import Page from './Page'

export default function Project(props) {
  const repository = Repository.create();
  const history = useHistory();

  return (
    <Page repository={repository} onBack={() => history.goBack()} id={props.match.params.id} />
  );
}
