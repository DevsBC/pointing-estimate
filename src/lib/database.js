import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDu3q0UOgPuiA4pUJtaytJ8Uc78eFRqNww',
  authDomain: 'satoru-co.firebaseapp.com',
  projectId: 'satoru-co',
  storageBucket: 'satoru-co.appspot.com',
  messagingSenderId: '551149990002',
  appId: '1:551149990002:web:1840cd45a9b77f32a492eb',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const baseCollection = 'pointing-estimate/1';

export function getUsers() {
  return toPromise(`${baseCollection}/users`);
}

function toPromise(ref) {
  let resolveValue;
  let error;
  const promise = new Promise((resolve, reject) => {
    (resolveValue = resolve), (error = reject);
  });

  onSnapshot(collection(db, ref), (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    resolveValue(data);
  });
  return promise;
}
