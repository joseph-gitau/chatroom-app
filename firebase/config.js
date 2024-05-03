// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAVP7NgV3rtvwBdp47RERqCs6Ohf66mBbY",
    authDomain: "chatroom-app-9ed9f.firebaseapp.com",
    projectId: "chatroom-app-9ed9f",
    storageBucket: "chatroom-app-9ed9f.appspot.com",
    messagingSenderId: "939900222052",
    appId: "1:939900222052:web:b409957b2acd1373f9bd71",
    measurementId: "G-4Y3JC3PT7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { auth };