import compare from "./compare"

let baseline = line("id", "number", "description", "vfxName", "fileName", "sourceIn", "sourceOut", "recordIn", "recordOut")

function line(id, number, description, vfxName, fileName, sourceIn, sourceOut, recordIn, recordOut){
  return {
  id: "id",
  number: "number",
  key: function(){
    return `${this.number}_${this.id}`;
  },
  description: "description",
  vfxName: "vfxName",
  fileName: "fileName",
  sourceIn: 1,
  sourceOut: 2,
  recordIn: 3,
  recordOut: 4,
  sourceDuration: function(imagePerSeconde) {
    return dateDuration(this.sourceIn, this.sourceOut, imagePerSeconde);
  },
  recordDuration: function(imagePerSeconde) {
    return dateDuration(this.recordIn, this.recordOut, imagePerSeconde);
  }
}
}

it('compare same edl', () => {
  let result = compare([baseline], [baseline]);
  expect(result[0]).toStrictEqual({
    id:"id",
    type:"identity",
    changes: [],
    lineA: baseline,
    lineB: baseline
  }) 
});

it('compare same edl with modification', () => {
  let lineB = Object.assign({}, baseline, {
    description: "another description",
    vfxName: "another vfxName"
  })
  let result = compare([baseline], [lineB]);
  expect(result[0]).toStrictEqual({
    id:"id",
    type:"modify",
    changes: ["description", "vfxName"],
    lineA: baseline,
    lineB: lineB
  }) 
});

it('compare empty edl with one line edl should find one addition', () => {
  let result = compare([], [baseline]);
  expect(result[0]).toStrictEqual({
    id:"id",
    type:"add",
    changes: [],
    lineA: undefined,
    lineB: baseline
  }) 
});

it('compare one line edl with empty edl should find one removed', () => {
  let result = compare([baseline], []);
  expect(result[0]).toStrictEqual({
    id:"id",
    type:"remove",
    changes: [],
    lineA: baseline,
    lineB: undefined
  }) 
});
