const path = require('path');
const Firestore = require('@google-cloud/firestore');

const FIRESTORE_KEYFILE = process.env.FIRESTORE_KEYFILE
  || path.join(__dirname, '../../secrets/firestore-cym.json');

const db = new Firestore({
  projectId: 'techfrederick-hackathon-cym',
  keyFilename: FIRESTORE_KEYFILE,
});

module.exports = db;
