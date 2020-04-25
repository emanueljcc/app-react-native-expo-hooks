import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyC63cp_G4urDqGCkR652N151tpOGDBf18A",
    authDomain: "app-restaurants-2c49c.firebaseapp.com",
    databaseURL: "https://app-restaurants-2c49c.firebaseio.com",
    projectId: "app-restaurants-2c49c",
    storageBucket: "app-restaurants-2c49c.appspot.com",
    messagingSenderId: "818617737090",
    appId: "1:818617737090:web:a55d43b0807d8d6ffc399b"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);