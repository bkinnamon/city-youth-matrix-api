const db = require('./db.js');

const collectionName = process.env.DEBUG ? 'test_events' : 'events';

const errInvalid = {
  status: 400,
  message: 'The provided information was invalid',
};

const errNotFound = {
  status: 404,
  message: 'The event could not be found',
};

function isValid(event) {
  return event.name && event.partner && event.start && event.end && event.description;
}

function docToEvent(eventDoc) {
  return {
    ...eventDoc.data(),
    id: eventDoc.id,
  };
}

async function getAll() {
  const eventDocs = await db.collection(collectionName).get();
  const events = eventDocs.docs.map(docToEvent);
  return [events, null];
}

async function get(id) {
  const eventDoc = await db.collection(collectionName).doc(id).get();
  if (!eventDoc.exists) return [null, errNotFound];
  return [docToEvent(eventDoc), null];
}

async function create(event) {
  if (!isValid(event)) return [null, errInvalid];
  const eventDocRef = await db.collection(collectionName).add(event);
  const eventDoc = await eventDocRef.get();

  return [docToEvent(eventDoc), null];
}

async function update(id, event) {
  if (!isValid(event)) return [null, errInvalid];
  if (!id) return [null, errInvalid];
  try {
    await db.collection(collectionName).doc(id).update(event);
  } catch (err) {
    return [null, errNotFound];
  }

  return [{
    ...event,
    id,
  }, null];
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
