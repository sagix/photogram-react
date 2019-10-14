function parse(rawData){
  return splitLines(rawData)
    .map(parseLine)
    .filter(line => line !== undefined);
}

function splitLines(rawData){
  return rawData.replace(/\s{0,1}[\n\r]{1,2}\*\s{0,1}/g, "").split("\n").filter(line => line.length > 0);
}

function parseLine(value){
  let number = value.match(/(^\d+)/);
  let dates = value.match(/(\d+:\d+:\d+:\d+)/g);
  let vfxName = value.match(/.*FROM CLIP NAME:\s*(.*)\s*LOC/)
  let idAndDesc = value.match(/\s([\S]+)\s\/\/\s(.*)SOURCE FILE:/)
  let sourceFile = value.match(/SOURCE FILE: ([\S]+)/)
  if(number === null || dates === null || vfxName === null || idAndDesc === null || sourceFile === null){
    return undefined;
  }
  return {
    id: idAndDesc[1],
    number: number[1],
    key: function(){
      return `${this.number}_${this.id}`;
    },
    description: idAndDesc[2].trim().toLowerCase(),
    vfxName: vfxName[1].trim(),
    fileName: sourceFile[1].trim(),
    sourceIn: toDate(dates[0]),
    sourceOut: toDate(dates[1]),
    recordIn: toDate(dates[2]),
    recordOut: toDate(dates[3]),
    sourceDuration: function(imagePerSeconde) {
      return dateDuration(this.sourceIn, this.sourceOut, imagePerSeconde);;
    },
    recordDuration: function(imagePerSeconde) {
      return dateDuration(this.recordIn, this.recordOut, imagePerSeconde);
    }
  };
}

function toDate(value){
  let stringValues = value.split(":");
  if(stringValues.length === 4){
    let values = stringValues.map(s => parseInt(s));
    return {
      hours: values[0],
      minutes: values[1],
      secondes: values[2],
      images: values[3],
    }
  }else{
    return undefined;
  }
}

function dateDuration(din, dout, numberOfImages){
  return ((dout.hours - din.hours) * 3600
    + (dout.minutes - din.minutes) * 60
    + (dout.secondes - din.secondes)
  ) * numberOfImages + (dout.images - din.images)
}

export default parse


//[\sA-Z]+(\d+:\d+:\d+:\d+)\s(\d+:\d+:\d+:\d+)\s(\d+:\d+:\d+:\d+)\s(\d+:\d+:\d+:\d+)[\s]+FROM CLIP NAME:[\s]+([\w\/\-\*\s]*)[\s*\w\r\n]+LOC: (\d+:\d+:\d+:\d+)[\s\w]+(\d{3}_\d{3})[\s\/]+([\w\s+]*)[\s\w]+SOURCE FILE:\s+([\w_]+)
