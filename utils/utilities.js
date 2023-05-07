const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile for use in async
const readFilePromise = util.promisify(fs.readFile);

// Writes data to destination with proper format
const writeToFile = (destination, contentToAdd) => {
    fs.writeFile(
        destination, 
        JSON.stringify(contentToAdd, null, 4), 
        (err) => err ? console.error(err) : console.info(`\n Data written to ${destination}`)
    );
}
    
    

// Reads database file, parses it, adds new data, writes to file with above function, returns new array to be sent in res
const appendData = (dataToAdd, file) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const jsonFormat = JSON.parse(data);
            jsonFormat.push(dataToAdd);
            writeToFile(file, jsonFormat);
            return jsonFormat;
        }
    });
};

// Export functions to use in server
module.exports = { readFilePromise, writeToFile, appendData }