const bcrypt = require('bcryptjs');
const db = require('./db.js');

const BCRYPT_SALT_ROUNDS = 12;
const collectionName = process.env.DEBUG ? 'test_users' : 'users';

async function getUserDoc(username) {
  const snapshot = await db.collection(collectionName).where('username', '==', username).get();
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
    name: username,
    types: [],
    address1: null,
    address2: null,
    city: null,
    state: null,
    zip: null,
    phone: null,
  };
  const userDocRef = await db.collection(collectionName).add(user);
  const userDoc = await userDocRef.get();

  return [docToUser(userDoc), null];
}

async function login(username, password) {
  const userDoc = await getUserDoc(username);
  if (!userDoc) return [null, 'Username not found.'];
  if (!checkPassword(password, userDoc.get('passHash'))) return [null, 'Incorrect password.'];
  return [docToUser(userDoc), null];
}

async function getAll() {
  const userDocs = await db.collection(collectionName).get();
  const users = userDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return [users, null];
}

async function get(id) {
  if (!id) return [null, 'User not found.'];
  const userDoc = await db.collection(collectionName).doc(id).get();
  if (!userDoc.exists) return [null, 'User not found.'];
  return [docToUser(userDoc), null];
}

async function update(id, userData) {
  try {
    await db.collection(collectionName).doc(id).update(userData);
  } catch (err) {
    return [null, 'User not found'];
  }
  return [{
    ...userData,
    id,
  }, null];
}

async function destroy(id) {
  await db.collection(collectionName).doc(id).delete();
}

module.exports = {
  register,
  login,
  getAll,
  get,
  update,
  destroy,
};
