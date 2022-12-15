import React, { useState } from 'react';
import parser from './parser';
import Empty from './Empty';
import Edls from './Edls';
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
        result: temporaryFileReader.result
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
        file: inputFile,
        result: temporaryFileReader.result
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
        const width = 320;
        const height = img.height * (width / img.width);
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

function Fixor(props) {

  const [edls, setEdls] = useState([]);


  function parseName(files, defaultName) {
    return Promise.resolve(Array.from(files).find(file => true)).then(file => {
      let name;
      if (file !== undefined && file.webkitRelativePath) {
        name = file.webkitRelativePath.split("/")[0];
      } else {
        name = defaultName
      }
      return name;
    });
  }

  function parseData(files) {
    return Promise.all(
      Array.from(files).filter(file => file.name.endsWith(".edl"))
    ).then(edls => {
      return Promise.all(edls.map(edl => readUploadedFileAsText(edl)));
    }).then(rawContents => {
      return rawContents.map(rawContent => {
        return {
          file: rawContent.file,
          data: parser(rawContent.result)
        }
      })
    }).then(results => {
      return results.map(r => r.data).flat().sort((a, b) => a.id.localeCompare(b.id));
    })
  }

  function parseImages(files) {
    let imageType = /^image\//;

    return Promise.all(Array.from(files).filter(file => imageType.test(file.type))).then(images => {
      return Promise.all(images.map(image => compress(image).then(smallImage => readUploadedFileAsUrl(smallImage))))
    });
  }

  function onFiles(files) {
    Promise.all([
      parseName(files, "edl " + (edls.length + 1)),
      parseData(files),
      parseImages(files)
    ]).then(results => {
      let [name, data, images] = results;

      data.forEach(d => {
        let imageResults = images.filter(i => i.file.name.toLowerCase().includes(d.id.toLowerCase()))
        if (imageResults.length === 1) {
          d.image = imageResults[0].result;
        } else {
          let imageResults2 = imageResults.filter(i => i.file.name.toLowerCase().includes(d.description.toLowerCase() + '.'));
          if (imageResults2.length === 1) {
            d.image = imageResults2[0].result;
          }
        }
      });

      let edl = {
        name: name,
        data: data
      }

      setEdls([...edls, edl]);
    }).catch(error => {
      console.warn(error);
    });
  }

  let content;
  if (edls.length === 0) {
    content = (<Empty onFiles={onFiles} />)
  } else {
    content = (
      <Edls onFiles={onFiles} edls={edls} />
    )
  }
  return (
    <div className="fixor-container">
      {content}
    </div>
  );

}

export default Fixor;
