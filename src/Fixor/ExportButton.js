import React, { Component } from 'react';
import './Table.css'

function createFile(gapi, fileMetadata) {
  return new Promise((resolve, reject) => {
    console.log(gapi.client);
    gapi.client.drive.files.create({
      resource: fileMetadata,
    }).then(function(response) {
      switch(response.status){
        case 200:
          resolve(response.result);
          break;
        default:
          reject(new DOMException('Error creating the folder, '+response));
          break;
        }
    }, error => {
      reject(error);
    });
  });
}

function listFiles(gapi, fileMetadata) {
  return new Promise((resolve, reject) => {
    console.log(gapi.client);
    gapi.client.drive.files.list(fileMetadata).then(function(response) {
      console.log(response);
      switch(response.status){
        case 200:
          resolve(response.result);
          break;
        default:
          reject(new DOMException('Error creating the folder, '+response));
          break;
        }
    }, error => {
      reject(error);
    });
  });
}

class ExportButton  extends Component{
  constructor(props){
      super(props)
      this.state ={
          document: undefined,
      }
  }

  getDir(gapi, name){
    return listFiles(gapi, {
          'pageSize': 10,
          'fields': "nextPageToken, files(id, name)",
          'q': `name='${name}' and mimeType='application/vnd.google-apps.folder'`
    }).then(result => {
      if(result.files.length >= 1){
        return result.files[0];
      }else{
        console.log(result);
        console.log(`creating new directory ${name}`);
        return createFile(gapi, {
          'name' : name,
          'mimeType' : 'application/vnd.google-apps.folder',
          'parents': []
        });
      }
    })
  }

  export = () => {
    const gapi = this.props.gapi;

    this.getDir(gapi, "Fixor").then(file => {
      return createFile(gapi, {
        'name' : 'data',
        'mimeType' : "application/vnd.google-apps.spreadsheet",
        'parents': [file.id]
      })
    }).then(file => {
      this.setState(Object.assign(this.state, {document: file}));
      this.exportData();
    }).catch(error => {
      console.warn(error);
    });
  }

  exportData(){
    const gapi = this.props.gapi;
    var values = this.props.data.map((line) => {
      return [
        line.id,
        "",
        line.description,
        line.sourceDuration(this.props.imagePerSeconde),
        line.vfxName,
        line.fileName,
      ];
    })
    var body = {
      values: values
    };
    console.log(body);
    gapi.client.sheets.spreadsheets.values.update({
       spreadsheetId: this.state.document.id,
       range: "A2",
       valueInputOption: "RAW",
       resource: body
    }).then((response) => {
      var result = response.result;
      console.log(`${result.updatedCells} cells updated.`);
    }, (error) => console.warn(error));
  }

  render(){
      if(this.props.gapi){
          return (
            <span>
              <button disabled={this.props.data && this.props.data.length === 0} onClick={this.export}>Export to Google spreadsheets</button>
              <SpeadSheetLink document={this.state.document}/>
            </span>
          )
      }else{
        return (<em>To export your date you need to connect with your Google Account</em>)
      }
  }
}

class SpeadSheetLink extends Component{
  render(){
    console.log(this.props.document)
    let url;
    if(this.props.document !== undefined && this.props.document.spreadsheetUrl !== undefined ){
      url = this.props.document.spreadsheetUrl;
      console.log(this.props.document.spreadsheetUrl);
    }else{
      url = undefined;
    }
    console.log(url);
    if(url !== undefined){
      return <a disabled={url === undefined} href={url}>{this.props.document.properties.title}</a>
    }else{
      return <span />
    }
  }

}

export default ExportButton
