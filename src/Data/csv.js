import Papa from 'papaparse';
class Csv{

    execute(files){
        let result = Array.from(files).filter(file => file.name === "data.csv")
        if(result.length === 0){
            return Promise.reject(new Error('Could not found data.csv'))
        }
        return new Promise((resolve, reject) => Papa.parse(result[0], {
            complete:resolve,
            error:reject
        }))
        .then(parsed => {
            var result = [];
            for (let r of parsed.data) {
                if(r[0] && r[0].length > 0){
                    result.push({
                        id: r[0],
                        sequence: r[0],
                        action: r[1],
                        place: (r[2] || "").trim(),
                        periode: (r[3] || "").trim(),
                        fx: r[4],
                    })
                }
            }
            return result
        })
    }
}

export default Csv
