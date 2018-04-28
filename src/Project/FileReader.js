export default function (file) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    reader.onload = () => {
      resolve({file: file, result:reader.result});
    };
    reader.readAsArrayBuffer(file);
  });
};
