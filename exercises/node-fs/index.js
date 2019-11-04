const fs = require("fs");
//
function logSizes(arg) {
    fs.readdir(arg, { withFileTypes: true }, function(err, files) {
        if (err) {
            console.log("there was an error");
        } else {
            files.forEach(file => {
                const resultat = arg + "/" + file;
                fs.stat(resultat, function(err, stats) {
                    if (err) {
                        console.log("an error occured");
                    } else if (stats.isFile()) {
                        console.log(resultat + ": " + stats.size);
                    } else {
                        logSizes(resultat);
                    }
                });
            });
        }
    });
}

function mapSizes(arg) {
    const read = fs.readdirSync(arg);
    const final = {};
    for (var i = 0; i < read.length; i++) {
        const newPath = arg + "/" + read[i];
        const nouvelle = fs.statSync(newPath);
        if (nouvelle.isFile()) {
            final[read[i]] = nouvelle.size;
        } else {
            final[read[i]] = mapSizes(newPath);
            //do recursion so the folder is reused in the function, so its contents are put as key/value
        }
        //loop if dir > if file size
    }
    console.log(final);
    return final;
}
logSizes(__dirname + "/files");

fs.writeFileSync(
    "files.json",
    JSON.stringify(mapSizes(__dirname + "/files"), null, 4)
);
