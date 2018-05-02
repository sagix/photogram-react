function readAsArrayBuffer(file){
    return new Promise((resolve, reject) => {
        _createReader(resolve, reject, file).readAsArrayBuffer(file);
    });
}

function readAsText(file){
    return new Promise((resolve, reject) => {
        _createReader(resolve, reject, file).readAsText(file);
    });
}

function _createReader(resolve, reject, file){
    const reader = new FileReader();
    reader.onerror = () => {
        reader.abort();
        reject(new Error("Problem parsing input file."));
    };
    reader.onload = () => {
        resolve({file: file, result:reader.result});
    };
    return reader
}

export {readAsText, readAsArrayBuffer}
