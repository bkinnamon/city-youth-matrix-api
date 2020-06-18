const bcrypt = require('bcryptjs');
const db = require('./db.js');

const BCRYPT_SALT_ROUNDS = 12;

async function getUserDoc(username) {
  const snapshot = await db.collection('users').where('username', '==', username).get();
  if (snapshot.size !== 1) return null;
  return snapshot.docs[0];
}

function hashPassword(password) {
  return bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
}

function checkPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function docToUser(userDoc) {
  const user = {
    ...userDoc.data(),
    id: userDoc.id,
  };
  delete user.passHash;

  return user;
}

async function register(username, password) {
  if (await getUserDoc(username)) return [null, 'Username already exists.'];
  const passHash = hashPassword(password);
  const user = {
    username,
    passHash,
  };
  const userDocRef = await db.collection('users').add(user);
  const userDoc = await userDocRef.get();

  return [docToUser(userDoc), null];
}

async function login(username, password) {
  const userDoc = await getUserDoc(username);
  if (!userDoc) return [null, 'Username not found.'];
  if (!checkPassword(password, userDoc.get('passHash'))) return [null, 'Incorrect password.'];
  return [docToUser(userDoc), null];
}

async function getUser(id) {
  const userDoc = await db.collection('users').doc(id).get();
  if (!userDoc.exists) return [null, 'Invalid JWT.'];
  return [docToUser(userDoc), null];
}

module.exports = {
  register,
  login,
  getUser,
};
