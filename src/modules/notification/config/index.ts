import * as admin from 'firebase-admin';

const serviceAccount = 'test-firebase-adminsdk-ww9ak-fe432d870e.json';

const firebaseConfig = {
  apiKey: 'AIzaSyArM_huaRbNw8SzGIA_FEioqEZdVzL1qPA',
  authDomain: 'holidays-c28f4.firebaseapp.com',
  projectId: 'holidays-c28f4',
  storageBucket: 'holidays-c28f4.appspot.com',
  messagingSenderId: '824366062131',
  appId: '1:824366062131:web:e473d6be361dc6d58ea146'
};

if (!admin.apps.length) {
  admin.initializeApp(
    firebaseConfig
    //       {
    //     credential: admin.credential.cert(serviceAccount),
    //     databaseURL: 'https://test.firebaseio.com'
    //   }
  );
}

export default admin;
