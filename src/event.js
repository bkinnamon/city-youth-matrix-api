const db = require('./db.js');

const errInvalid = {
  status: 400,
  message: 'The provided information was invalid',
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
  const eventDocs = await db.collection('events').get();
  const events = eventDocs.docs.map(docToEvent);
  return [events, null];
}

async function get(id) {
  const eventDoc = db.collection('events').doc(id).get();
  return [docToEvent(eventDoc), null];
}

async function create(event) {
  if (!isValid(event)) return [null, errInvalid];
  const eventDocRef = await db.collection('events').add(event);
  const eventDoc = await eventDocRef.get();

  return [docToEvent(eventDoc), null];
}

module.exports = {
  create,
  getAll,
  get,
};
