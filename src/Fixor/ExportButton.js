import React, { useState } from 'react';
import './Table.css'

function ExportButton(props) {

  let [document, setDocument] = useState(undefined);

  function createFile(gapi, fileMetadata) {
    return new Promise((resolve, reject) => {
      console.log(gapi.client);
      gapi.client.drive.files.create({
        resource: fileMetadata,
      }).then(function (response) {
        switch (response.status) {
          case 200:
            resolve(response.result);
            break;
          default:
            reject(new DOMException('Error creating the folder, ' + response));
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
      gapi.client.drive.files.list(fileMetadata).then(function (response) {
        console.log(response);
        switch (response.status) {
          case 200:
            resolve(response.result);
            break;
          default:
            reject(new DOMException('Error creating the folder, ' + response));
            break;
        }
      }, error => {
        reject(error);
      });
    });
  }

  function getDir(gapi, name) {
    return listFiles(gapi, {
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)",
      'q': `name='${name}' and mimeType='application/vnd.google-apps.folder'`
    }).then(result => {
      if (result.files.length >= 1) {
        return result.files[0];
      } else {
        console.log(result);
        console.log(`creating new directory ${name}`);
        return createFile(gapi, {
          'name': name,
          'mimeType': 'application/vnd.google-apps.folder',
          'parents': []
        });
      }
    })
  }

  function onExport() {
    const gapi = props.gapi;

    getDir(gapi, "Fixor").then(dir => {
      return createFile(gapi, {
        'name': 'data',
        'mimeType': "application/vnd.google-apps.spreadsheet",
        'parents': [dir.id]
      })
    }).then(spreadsheet => {
      setDocument(spreadsheet);
      exportData(spreadsheet.id);
    }).catch(error => {
      console.warn(error);
    });
  }

  function exportData(id) {
    const gapi = props.gapi;
    var values = props.data.map((line) => {
      return [
        line.id,
        "",
        line.description,
        line.sourceDuration(props.imagePerSeconde).toString(),
        line.vfxName,
        line.fileName,
      ];
    })
    var body = {
      values: values
    };
    console.log(body);
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: id,
      range: "A2",
      valueInputOption: "RAW",
      resource: body
    }).then((response) => {
      var result = response.result;
      console.log(`${result.updatedCells} cells updated.`);
    }, (error) => console.warn(error));
  }

  if (props.gapi) {
    return (
      <span>
        <button disabled={props.data && props.data.length === 0} onClick={onExport}>Export to Google spreadsheets</button>
        <SpeadSheetLink document={document} />
      </span>
    )
  } else {
    return (<em>To export your date you need to connect with your Google Account</em>)
  }
}

function SpeadSheetLink(props) {

  console.log(props.document)
  let url;
  if (props.document !== undefined && props.document.id !== undefined) {
    url = `https://docs.google.com/spreadsheets/d/${props.document.id}`;
  } else {
    url = undefined;
  }
  console.log(url);
  if (url !== undefined) {
    return <a disabled={url === undefined} href={url}>Spreadsheet</a>
  } else {
    return <span />
  }
}

export default ExportButton
