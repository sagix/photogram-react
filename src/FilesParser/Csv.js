import Papa from 'papaparse';

export default class Csv {

    execute(files) {
        let result = Array.from(files).filter(file => file.name === "data.csv")
        if (result.length === 0) {
            return Promise.reject(new Error('Could not found data.csv'))
        }
        return new Promise((resolve, reject) => Papa.parse(result[0], {
            complete: resolve,
            error: reject
        })).then(parsed => {
            var result = [];
            for (let r of parsed.data) {
                const id = this.parseId(r[0])
                if (id !== null) {
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

    parseId(id) {
        const trimedId = id.trim()
        const pattern = /^\d/
        if (trimedId.match(pattern) !== null) {
            return trimedId
        }
        return null
    }
}
