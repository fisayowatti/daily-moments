import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAeU973HLt5HsudKIjSL4yOEZxya3Ighc",
    authDomain: "daily-moments-78712.firebaseapp.com",
    databaseURL: "https://daily-moments-78712.firebaseio.com",
    projectId: "daily-moments-78712",
    storageBucket: "daily-moments-78712.appspot.com",
    messagingSenderId: "865103279902",
    appId: "1:865103279902:web:a4725b1fbf9e3f8cd07b0f",
    measurementId: "G-ZH7HHE114B"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();