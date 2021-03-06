import React, { Component } from 'react';
import parser from './parser';
import Table from './Table';
import GoogleApi from './GoogleApi'
import ExportButton from './ExportButton'
import './index.css'

const readUploadedFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve({
        file: inputFile,
        result :temporaryFileReader.result
      });
    };
    temporaryFileReader.readAsText(inputFile);
  });
};


const readUploadedFileAsUrl = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve({
        file : inputFile,
        result : temporaryFileReader.result
      });
    };
    temporaryFileReader.readAsDataURL(inputFile);
  });
};

const compress = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      const img = new Image();
      img.src = temporaryFileReader.result;
      img.onload = () => {
        const elem = document.createElement('canvas');
        const width= 320;
        const height= img.height * (width/img.width);
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        // img.width and img.height will contain the original dimensions
        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob((blob) => {
            resolve(new File([blob], inputFile.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
            }));
        }, 'image/jpeg', 1);
      }
      img.onerror = () => {
        reject(new DOMException("Problem parsing input file."));
      };
    };
    temporaryFileReader.readAsDataURL(inputFile);
  });
};

class Fixor extends Component {

  constructor(props){
      super(props)
      this.state ={
          data: [],
          imagePerSeconde: 25
      }
  }

  parseData(files){
    return Promise.all(
      Array.from(files).filter(file => file.name.endsWith(".edl"))
    ).then(edls => {
      return Promise.all(edls.map(edl => readUploadedFileAsText(edl)));
    }).then(rawContents => {
      return rawContents.map(rawContent => {return {
        file: rawContent.file,
        data: parser(rawContent.result)
      }})
    }).then(results => {
      console.log(results);
      return results.map(r => r.data).flat().sort((a, b) => a.id.localeCompare(b.id));
    })
  }

  parseImages(files){
    let imageType = /^image\//;

    return Promise.all(Array.from(files).filter(file => imageType.test(file.type))).then(images => {
      return Promise.all(images.map(image => compress(image).then(smallImage => readUploadedFileAsUrl(smallImage))))
    });
  }

  onFiles(files){
    Promise.all([
      this.parseData(files),
      this.parseImages(files)
    ]).then(results => {
      let [data, images] = results;

      data.forEach(d => {
        let image = images.filter(i => i.file.name.toLowerCase().includes(d.id.toLowerCase()))[0]
        if(image !== undefined){
          d.image = image.result;
        }
      });

      this.setState({
        data: data
      });
    }).catch(error => {
      console.warn(error);
    });
  }

  onImagePerSecond = (event) => {
    this.setState(Object.assign(this.state, {
      imagePerSeconde: event.target.value
    }))
  }

 selectElementContents(el, callback) {
    var range = document.createRange();
    var sel =  window.getSelection();
    sel.removeAllRanges();
    try {
        range.selectNodeContents(el);
        sel.addRange(range);
    } catch (e) {
        range.selectNode(el);
        sel.addRange(range);
    }
    callback()
    sel.removeAllRanges();
}

  copy= () => {
    this.selectElementContents(document.getElementById("fixor-table"), () => document.execCommand("copy"));
  }

  render(){
      return (
          <div>
          <form>
              <input type="file" id="new-project-file"
                  webkitdirectory={true.toString()}
                  directory={true.toString()}
                  multiple={true}
                  onChange={(event) => {
                      this.onFiles(event.target.files)
                      event.target.form.reset()
                  }}/>
              <label htmlFor="new-project-file" id="new-project-label">New project</label>
              <input type="number" onChange={this.onImagePerSecond} defaultValue={this.state.imagePerSeconde}/>
          </form>
          <button onClick={this.copy}>Copy</button>
          <GoogleApi
            apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            discoveryDocs={["https://sheets.googleapis.com/$discovery/rest?version=v4"]}
            scope="https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file">
              <ExportButton data={this.state.data}  imagePerSeconde={this.state.imagePerSeconde}/>
          </GoogleApi>
          <Table data={this.state.data} imagePerSeconde={this.state.imagePerSeconde}/>
          </div>
      );
    }
}

export default Fixor;
