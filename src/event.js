const db = require('./db.js');
const errors = require('./errors.js');

const collectionName = process.env.DEBUG ? 'test_events' : 'events';

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
  if (!eventDoc.exists) return [null, errors.notFound];
  return [docToEvent(eventDoc), null];
}

async function create(event) {
  if (!isValid(event)) return [null, errors.badRequest];
  const eventDocRef = await db.collection(collectionName).add(event);
  const eventDoc = await eventDocRef.get();

  return [docToEvent(eventDoc), null];
}

async function update(id, event) {
  if (!isValid(event)) return [null, errors.badRequest];
  if (!id) return [null, errors.badRequest];
  try {
    await db.collection(collectionName).doc(id).update(event);
  } catch (err) {
    return [null, errors.notFound];
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
