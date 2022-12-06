// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { collection, getFirestore } from 'firebase/firestore'
import { FireStoreCollection } from './types'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'time-tracking-app-9583a.firebaseapp.com',
  projectId: 'time-tracking-app-9583a',
  storageBucket: 'time-tracking-app-9583a.appspot.com',
  messagingSenderId: '957661681064',
  appId: '1:957661681064:web:74dcb6594f6bbe3eeab99d',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const tasksColRef = collection(db, FireStoreCollection.TASKS)
const tagsColRef = collection(db, FireStoreCollection.TAGS)
const workUnitsColRef = collection(db, FireStoreCollection.WORKUNIT)

export { app, db, tagsColRef, tasksColRef, workUnitsColRef }
