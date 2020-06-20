const db = require('./db.js');
const errors = require('./errors.js');

const collectionName = process.env.DEBUG ? 'test_registrations' : 'registrations';

function generate(data) {
  const reg = data;
  if (reg.notes === undefined || reg.notes == null) reg.notes = '';
  if (!reg.pickup || reg.pickup === null) reg.pickup = { driverName: '', driverId: '' };
  if (!reg.return || reg.return === null) reg.return = { driverName: '', driverId: '' };
  return reg;
}

function isValid(data) {
  if (!data.familyId) return false;
  if (!Array.isArray(data.children) || data.children.length === 0) return false;
  if (!Array.isArray(data.adults) || data.adults.length === 0) return false;
  if (data.pickup === undefined || data.return === undefined) return false;

  return true;
}

function docToReg(doc) {
  return {
    ...doc.data(),
    id: doc.id,
  };
}

async function create(data) {
  const reg = generate(data);
  if (!isValid(reg)) return [null, errors.badRequest];
  const docRef = await db.collection(collectionName).add(data);
  const doc = await docRef.get();

  return [docToReg(doc), null];
}

async function getAll() {
  const collection = await db.collection(collectionName).get();
  const regs = collection.docs.map(docToReg);

  return [regs, null];
}

async function get(id) {
  const doc = await db.collection(collectionName).doc(id).get();
  if (!doc.exists) return [null, errors.notFound];

  return [docToReg(doc), null];
}

async function update(id, data) {
  const reg = generate(data);
  if (!isValid(reg) || !id) return [null, errors.badRequest];
  try {
    await db.collection(collectionName).doc(id).update(data);
  } catch (err) {
    return [null, errors.notFound];
  }

  return [{ ...data, id }, null];
}

async function destroy(id) {
  await db.collection(collectionName).doc(id).delete();
}

module.exports = {
  create,
  getAll,
  get,
  update,
  destroy,
};
