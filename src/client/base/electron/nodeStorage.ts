const { app } = require('electron');
const JSONStorage = require('node-localstorage').JSONStorage;
const storageLocation = app.getPath('userData');
const nodeStorage = new JSONStorage(storageLocation);

export default nodeStorage