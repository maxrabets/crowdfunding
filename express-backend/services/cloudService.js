const firebase = require('../config/firebaseStorage');

async function saveFile(file) {    
    if (file) {
        const name = Date.now() + file.originalname;
        const firebaseFile = firebase.bucket.file(name);
        await firebaseFile.save(file.buffer);
        // const signedUrl = await firebaseFile.getSignedUrl();
        // console.log("signed " + signedUrl);
        // const publicUrl = firebaseFile.publicUrl();
        // console.log("publicUrl " + publicUrl);
        return name;
    }    
}

async function saveFiles(files) {
    const names = [];
    for(let i = 0; i < files.length; i++) {
        const name = await saveFile(files[i]);
        if(name){
            names.push(name);
        }
        else
            return false;
    }
    return names;
}

async function getFile(name) {    
    if(name) {
        const firebaseFile = firebase.bucket.file(name);
        const data = await firebaseFile.download();
        return data[0];
    }    
}

async function getFiles(names) {    
    const files = [];
    for(let i = 0; i < names.length; i++) {
        const file = await getFile(names[i]);
        if(file){
            files.push(file);
        }
        else
            return false;
    }
    return files;  
}

exports.saveFile = saveFile;
exports.saveFiles = saveFiles;
exports.getFile = getFile;
exports.getFiles = getFiles;