
const firebaseConfig = {
    apiKey: "AIzaSyAXf-p2Wo5Ush1BP57ehCaYIZLoHV3CeCE",
    authDomain: "siamhora-c6b27.firebaseapp.com",
    projectId: "siamhora-c6b27",
    storageBucket: "siamhora-c6b27.firebasestorage.app",
    messagingSenderId: "148386870420",
    appId: "1:148386870420:web:fd6e6bf4a1bb5555a2b081",
    measurementId: "G-DH8VVHWKQ5"
};

// Initialize Firebase v8
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
window.firebaseApp = firebase.app();
window.firebaseDb = firebase.firestore();

