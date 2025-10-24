import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAa6QY_SBpbn9vkRq6VQ8lFl4-oNyWKAks',
  authDomain: 'shippingbackend.firebaseapp.com',
  projectId: 'shippingbackend',
  storageBucket: 'shippingbackend.firebasestorage.app',
  messagingSenderId: '671906577144',
  appId: '1:671906577144:web:1798cdf8981fd0ac8ed90d',
  measurementId: 'G-K92DCKVR4Z',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
