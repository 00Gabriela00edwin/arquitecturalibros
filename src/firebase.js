import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1_llfVpLKmtVxxY2bsaf0YiNR54JKwNM",
  authDomain: "archi-books.firebaseapp.com",
  projectId: "archi-books",
  storageBucket: "archi-books.firebasestorage.app",
  messagingSenderId: "1023306933506",
  appId: "1:1023306933506:web:ff7551f2e284d853590e1b",
  measurementId: "G-D0NHKD6K7V"
};

export const app = initializeApp(firebaseConfig);

// 2. Exportamos la referencia a la base de datos para usarla en App.jsx
export const db = getFirestore(app);