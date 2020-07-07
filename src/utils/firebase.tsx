import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCfqt8Jw1VWYkL9cPnyfTAG0BF5aylB_VY',
  authDomain: 'liquidity-wallet.firebaseapp.com',
  databaseURL: 'https://liquidity-wallet.firebaseio.com',
  projectId: 'liquidity-wallet',
  storageBucket: 'liquidity-wallet.appspot.com',
  messagingSenderId: '740004913746',
  appId: '1:740004913746:web:96d4642c6dc08825'
};

const app = firebase.initializeApp(firebaseConfig);
const firebaseDb = app.database();

export const fetchTokensMetadata = async () => {
  try {
    const snapshot = await firebaseDb.ref('tokens').once('value');
    return snapshot.val();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const db = { fetchTokensMetadata };
