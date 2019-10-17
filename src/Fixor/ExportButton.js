import React, { Component } from 'react';
import './Table.css'

class ExportButton  extends Component{
  constructor(props){
      super(props)
      this.state ={
          document: undefined,
      }
  }
  export = () => {
    const gapi = this.props.gapi;
    gapi.client.sheets.spreadsheets.create({
      properties: {
        title: "Fixor test"
      }
    }).then((response) => {
      console.log(response);
      if(response.status === 200){
          this.setState(Object.assign(this.state, {document: response.result}))
      }
      this.exportData()
    }, (error) => {
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
       spreadsheetId: this.state.document.spreadsheetId,
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
