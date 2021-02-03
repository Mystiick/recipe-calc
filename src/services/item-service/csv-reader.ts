export class CsvReader {
    public constructor() {
    }

    public parse(rawText: string, bufferSkip: number) {
        let startTime = new Date();
    
        let lines = rawText.split('\n');
        let records: Array<Array<string>> = [];
        if (!bufferSkip) bufferSkip = 4;
    
        for (let i = bufferSkip; i < lines.length - 1; i++) {
            let columns: Array<string> = [];
            let splitString = lines[i].split(',');
    
            // Skip processing blank records
            if (!splitString[0]) continue;
    
            for (let j = 0; j < splitString.length; j++) {
                let record = splitString[j];
    
                // Check if the current record starts with a " but doesn't contain the ending string (happens when there's a newline or a ',' inside the record
                while (!this.isRecordClean(record)) {
    
                    // If incrementing j would push us over the length of the current line, move onto the next line manually
                    if (++j === splitString.length) {
                        j = 0;
                        i++;
                        splitString = lines[i].split(',');
                    }
    
                    record += ',' + splitString[j];
                }
    
                columns.push(this.cleanString(record));
            }
    
            records.push(columns);
        }
    
        console.log(`Done parsing file. Parsing took ${<any>new Date() - <any>startTime}ms`);
        return records;
    }

    // Valid records either don't contain any quotes, or both start and end with quotes
    public isRecordClean(record) {
        return record.indexOf('"') === -1 || (record.startsWith('"') && record.endsWith('"'));
    }

    // Removes leading and trailing quotes, also replaces "\r," with "\r"
    public cleanString(input) {
        if (!input) return undefined;

        if (input.charAt(0) === "\"") {
            input = input.substring(1);
        }

        if (input.charAt(input.length - 1) === "\"") {
            input = input.substring(0, input.length - 1);
        }

        input = input.replace(/\r(\n?),/g, '\r');

        return input;
    }
}
