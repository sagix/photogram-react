function parse(edl1, edl2){
	let ids = [...new Set(edl1.map((line) => line.id).concat(edl2.map((line) => line.id)))]
	return ids.map((id) => {
		let line1 = edl1.find((line) => line.id === id)
		let line2 = edl2.find((line) => line.id === id)
		let type;
		let changes = [];
		if (line1 !== undefined && line2 !== undefined) {
			changes = [
			    "id", 
			    "number", 
			    "description", 
			    "vfxName", 
			    "fileName", 
			    "sourceIn", 
			    "sourceOut", 
			    "recordIn",
    			"recordOut",
			].map((key) => {
				if(line1[key].toString() !== line2[key].toString()) {
					return key;
				} else {
					return undefined;
				}
			}).filter((value) => value !== undefined);
			if(changes.length === 0) {
				type = "identity"	
			} else {
				type = "modify"
			}
		} else if(line1 === undefined) {
			type = "add"
		} else if(line2 === undefined) {
			type = "remove"
		}
		return {
			id: id,
			type: type,
			changes: changes,
			lineA: line1,
			lineB: line2
		}
	});
}

export default parse
