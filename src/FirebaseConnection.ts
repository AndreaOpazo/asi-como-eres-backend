import firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert('privateKeys.json'),
  databaseURL: 'https://asi-como-eres-backend.firebaseio.com',
});

const firestore = firebaseAdmin.firestore();

export default firestore;