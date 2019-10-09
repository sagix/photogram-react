import Papa from 'papaparse';
class Csv{

    execute(url){
      console.log(url.toString());
        return new Promise((resolve, reject) => Papa.parse(url.toString(), {
            download: true,
            complete:resolve,
            error:reject
        }))
        .then(parsed => {
            var result = [];
            for (let r of parsed.data) {
                const id = this.parseId(r[0])
                if(id !== null){
                    result.push({
                        id: id,
                        sequence: id,
                        action: r[1],
                        label: (r[2] || "").trim(),
                        periode: (r[3] || "").trim(),
                        fx: r[4],
                    })
                }
            }
            return result
        })
    }

    parseId(id){
        if(id === undefined || id === null){
            return null
        }
        const trimedId = id.trim()
        const pattern = /^\d/
        if(trimedId.match(pattern) !== null){
            return trimedId
        }
        return null
    }
}

export default Csv
