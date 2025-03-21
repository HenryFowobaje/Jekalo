import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  QueryConstraint,
  query,
  getDocs,
  collection
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export const createDocument = async <T extends { id: string }>(
  collectionPath: string,
  data: T
): Promise<T> => {
  const docRef = doc(db, collectionPath, data.id);
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return data;
};

export const getDocument = async <T>(
  collectionPath: string,
  id: string
): Promise<T | null> => {
  const docRef = doc(db, collectionPath, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as T) : null;
};

export const updateDocument = async <T>(
  collectionPath: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionPath, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDocument = async (
  collectionPath: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionPath, id);
  await deleteDoc(docRef);
};

export const queryCollection = async <T>(
  collectionPath: string,
  constraints: QueryConstraint[]
): Promise<T[]> => {
  const collectionRef = collection(db, collectionPath);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
}; 