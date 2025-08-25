import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'earthquakes';

// Add new earthquake entry
export const addEarthquake = async (earthquakeData) => {
  try {
    console.log('🚀 Adding earthquake to Firebase:', earthquakeData);
    console.log('📊 Database instance:', db);
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...earthquakeData,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Earthquake added successfully with ID:', docRef.id);
    return { id: docRef.id, ...earthquakeData };
  } catch (error) {
    console.error('❌ Error adding earthquake: ', error);
    console.error('❌ Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Get all earthquakes
export const getEarthquakes = async () => {
  try {
    console.log('📖 Fetching earthquakes from Firebase...');
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const earthquakes = [];
    querySnapshot.forEach((doc) => {
      earthquakes.push({ id: doc.id, ...doc.data() });
    });
    console.log('✅ Fetched earthquakes:', earthquakes);
    return earthquakes;
  } catch (error) {
    console.error('❌ Error getting earthquakes: ', error);
    throw error;
  }
};

// Delete earthquake
export const deleteEarthquake = async (id) => {
  try {
    console.log('🗑️ Deleting earthquake with ID:', id);
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log('✅ Earthquake deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting earthquake: ', error);
    throw error;
  }
};

// Update earthquake
export const updateEarthquake = async (id, updateData) => {
  try {
    console.log('✏️ Updating earthquake with ID:', id);
    const earthquakeRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(earthquakeRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Earthquake updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating earthquake: ', error);
    throw error;
  }
};

// Real-time listener for earthquakes
export const subscribeToEarthquakes = (callback) => {
  try {
    console.log('👂 Setting up real-time listener for earthquakes...');
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const earthquakes = [];
      querySnapshot.forEach((doc) => {
        earthquakes.push({ id: doc.id, ...doc.data() });
      });
      console.log('📡 Real-time update received:', earthquakes);
      callback(earthquakes);
    }, (error) => {
      console.error('❌ Real-time listener error:', error);
    });
  } catch (error) {
    console.error('❌ Error setting up real-time listener:', error);
    throw error;
  }
};
