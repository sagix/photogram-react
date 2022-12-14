
class Line {
  constructor(
    id,
    number,
    reelName,
    description,
    vfxName,
    fileName,
    sourceIn,
    sourceOut,
    recordIn,
    recordOut
  ) {
    this.id = id;
    this.number = number;
    this.reelName = reelName;
    this.description = description;
    this.vfxName = vfxName;
    this.fileName = fileName;
    this.sourceIn = sourceIn;
    this.sourceOut = sourceOut;
    this.recordIn = recordIn;
    this.recordOut = recordOut
  }
  get key() {
    return `${this.number}_${this.id}`;
  }
  sourceDuration(imagePerSeconde) {
    return dateDuration(this.sourceIn, this.sourceOut, imagePerSeconde);
  }
  recordDuration(imagePerSeconde) {
    return dateDuration(this.recordIn, this.recordOut, imagePerSeconde);
  }
};

function parse(rawData) {
  return splitLines(rawData)
    .map(parseLine)
    .filter(line => line !== undefined);
}

function splitLines(rawData) {
  let results = [];
  var group = "";
  let lines = rawData.split(/[\n\r]{1,2}/);
  var inComment = false;
  const newComment = new RegExp(/\*\s{0,1}[\w\s]+:/);
  for (const line of lines) {
    if (RegExp(/^\w+:/g).test(line)) {
      results.push(line);
    } else if (RegExp(/\s{0,1}\*\s{0,1}.+/g).test(line)) {
      if(newComment.test(line)){
        group += "\n"
      }
      group += line.replace(/\*\s{0,1}/, "");
      inComment = true;
    } else {
      if (inComment) {
        results.push(group + "\n");
        group = ""
        group += line.trim();
        inComment = false;
      } else {
        if (group.length === 0) {
          group += line.trim();
        }
      }
    }
  }
  results.push(group);

  return results.filter(g => g !== undefined && g.length > 0);
}

function parseLine(value) {
  let number = value.match(/(^\d+)\s+(\S+)\s+/);
  let dates = value.match(/(\d+:\d+:\d+:\d+)/g);
  let vfxName = value.match(/.*FROM CLIP NAME:\s*(.*)\s*\n/)
  let idAndDesc = value.match(/LOC:.*\s([\S]+)\s\/\/\s(.*)\n/)
  let sourceFile = value.match(/SOURCE FILE: ([\S]+)/)

  if (number === null || dates === null || vfxName === null || idAndDesc === null || sourceFile === null) {
    return undefined;
  }
  return new Line(
    /*id*/ idAndDesc[1],
    /*number*/ number[1],
    /*reelName*/ number[2],
    /*description*/ idAndDesc[2].trim().toLowerCase(),
    /*vfxName*/ vfxName[1].trim(),
    /*fileName*/ sourceFile[1].trim(),
    /*sourceIn*/ toDate(dates[0]),
    /*sourceOut*/ toDate(dates[1]),
    /*recordIn*/ toDate(dates[2]),
    /*recordOut*/ toDate(dates[3])
  );
}

function toDate(value) {
  let stringValues = value.split(":");
  if (stringValues.length === 4) {
    let values = stringValues.map(s => parseInt(s));
    return {
      hours: values[0],
      minutes: values[1],
      secondes: values[2],
      images: values[3],
    }
  } else {
    return undefined;
  }
}

function dateDuration(din, dout, numberOfImages) {
  let duration = ((dout.hours - din.hours) * 3600
    + (dout.minutes - din.minutes) * 60
    + (dout.secondes - din.secondes)
  ) * numberOfImages + (dout.images - din.images);
  return Math.round((duration + Number.EPSILON) * 100) / 100
}

export default parse;
export {Line};