const express = require('express');
const app = express();
app.use(express.static('statics'));
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const csv = require('csv-parser');
const fs = require('fs');
const fsPromises = require('fs').promises;
const formidable = require('formidable');

function parseIncomingFiles(req) {
    return new Promise(function(resolve, reject) {
        const form = formidable({ multiples: true });

        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            let filesPaths = renameFiles(files);
            resolve(filesPaths);
        });
    });
}

function renameFiles(files) {
    const amonutOfFiles = files.uploadedFiles.length;
    if (amonutOfFiles === undefined) {
        let paths = [];
        paths.push(getSinglePath(files.uploadedFiles));
        return paths;
    } else {
        let paths = [];
        for (let i = 0; i < amonutOfFiles; i++) {
            paths.push(getSinglePath(files.uploadedFiles[i]));
        }
        return paths;
    }
}

function getSinglePath(file) {
    const fileName = file.name;
    const oldPath = file.path;

    let splitPath = oldPath.split('/');
    splitPath[splitPath.length - 1] = fileName;
    const newPath = splitPath.join('/');
    fs.rename(oldPath, newPath, function (err) {});
    return newPath;
}

function parseCsvToJsonMultipleFiles(filesPaths) {
    return new Promise(function(resolve, reject) {
        let requestedParsing = filesPaths.map(filePath => parseCsvToJsonSingleFile(filePath));
        
        Promise.all(requestedParsing)
        .then(function(parsedFiles) {
            deleteFiles(filesPaths);
            resolve(parsedFiles);
        });
    });
}

function deleteFiles(paths) {
    for (let i = 0; i < paths.length; i++) {
        fs.unlink(paths[i], () => {});
    }
}

function parseCsvToJsonSingleFile(filePath) {
    return new Promise(function(resolve, reject) {
        let parsedFile = [];
        let splitFilePath = filePath.split('/');
        let fileName = splitFilePath[splitFilePath.length - 1];

        parsedFile.push(fileName);

        fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => parsedFile.push(data))
        .on('end', () => {
            resolve(parsedFile);
        });
    });
}

function countPressedKeysFiles(parsedFiles) {
    return new Promise(function(resolve, reject) {
        let countedKeys = {
            'keyboardKeys': {},
            'mouseKeys': {}
        };

        for (let i = 0; i < parsedFiles.length; i++) {
            let fileName = parsedFiles[i][0];
    
            if (fileName.includes('key') && !fileName.includes('mkey')) {
                countedKeys['keyboardKeys'] = countPressedKeys(parsedFiles[i]);
            }

            if (fileName.includes('mkey')) {
                countedKeys['mouseKeys'] = countPressedKeys(parsedFiles[i]);
            }
        }

        resolve(countedKeys);
    });
}

function countPressedKeys(pressedKeyboardKeys) {
    let countedKeys = {};
    for (let i = 1; i < (pressedKeyboardKeys.length - 1); i++) {
        let currentlyPressedKeys = parsePressedKeysObject(pressedKeyboardKeys[i]);
        let nextPressedKeys = parsePressedKeysObject(pressedKeyboardKeys[i + 1]);

        if (currentlyPressedKeys !== null) {
            for (let j = 0; j < currentlyPressedKeys.length; j++) {
                let objectKeys = Object.keys(countedKeys);
                let currentKey = currentlyPressedKeys[j];

                if (objectKeys.includes(currentKey)) {
                    if (!nextPressedKeys.includes(currentKey)) {
                        countedKeys[currentKey] += 1;
                    }
                } else {
                    countedKeys[currentKey] = 1;
                }
            }
        }
    }

    return countedKeys;
}

function parsePressedKeysObject(unparsedPressedKeys) {
    try {
        let pressedKeysObject = unparsedPressedKeys.key;

        const regex = /(\w)+/g;
        let parsedKeys = pressedKeysObject.match(regex);

        if (parsedKeys === null) {
            parsedKeys = []
        }
    
        return parsedKeys;
    } catch (error) {
        let pressedKeysObject = unparsedPressedKeys.mouse_key;

        const regex = /(\w)+/g;
        let parsedKeys = pressedKeysObject.match(regex);

        if (parsedKeys === null) {
            parsedKeys = []
        }
    
        return parsedKeys;
    }
}

function renderErrorPage(res, msg) {
    let errorImageName = (Math.floor(Math.random() * Math.floor(4))).toString();
    let path = '/images/' + errorImageName + '.jpg';

    res.render('errorPage.ejs', {
        imagePath: path,
        msg: msg
    });
}



app.get('/', function(req, res) {
    res.render('landingPage.ejs');
});

app.post('/upload_files', urlencodedParser, function(req, res) {
    parseIncomingFiles(req)
    .then(relocatedFilesPaths => parseCsvToJsonMultipleFiles(relocatedFilesPaths))
    .then(parsedFiles => countPressedKeysFiles(parsedFiles))
    .then(countedKeys => res.render('statsPage.ejs', {
        keyboardKeys: countedKeys['keyboardKeys'],
        mouseKeys: countedKeys['mouseKeys']
    }))
    .catch(error => renderErrorPage(res, error));
});

app.use(function(req, res, next) {
    res.status(404);
    renderErrorPage(res, '404 Page does not exist');
});

app.use(function(req, res, next) {
    res.status(500);
    renderErrorPage(res, '500 Internal server error');
});

const server = app.listen(process.env.PORT, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at localhost%s%s', host, port);
});