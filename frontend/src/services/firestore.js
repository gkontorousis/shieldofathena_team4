import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc,
  setDoc,
  updateDoc,
  increment,
  Timestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const createDonation = async (userId, amount, recurring = false) => {
  try {
    const donationData = {
      user_id: userId || null,
      amount: amount,
      recurring: recurring,
      datetime: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'donations'), donationData);
    await updateTotalDonations(amount);
    
    return { id: docRef.id, ...donationData };
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
};

export const getUserDonations = async (userId) => {
  try {
    const q = query(
      collection(db, 'donations'),
      where('user_id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const donations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      datetime: doc.data().datetime?.toDate() || new Date()
    }));
    return donations.sort((a, b) => b.datetime - a.datetime);
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

export const getTotalDonations = async () => {
  try {
    const totalDoc = await getDoc(doc(db, 'stats', 'donations'));
    if (totalDoc.exists()) {
      const data = totalDoc.data();
      const totalAmount = data.total_amount || 0;
      const pixelsRevealed = Math.min(Math.floor(totalAmount / 10), 10000);
      return {
        total_amount: totalAmount,
        pixels_revealed: pixelsRevealed
      };
    }
    return { total_amount: 0, pixels_revealed: 0 };
  } catch (error) {
    console.error('Error fetching total donations:', error);
    return { total_amount: 0, pixels_revealed: 0 };
  }
};

const updateTotalDonations = async (amount) => {
  try {
    const statsRef = doc(db, 'stats', 'donations');
    const statsDoc = await getDoc(statsRef);
    
    if (statsDoc.exists()) {
      await updateDoc(statsRef, {
        total_amount: increment(amount)
      });
    } else {
      await setDoc(statsRef, {
        total_amount: amount
      });
    }
  } catch (error) {
    console.error('Error updating total donations:', error);
  }
};


export const getEvents = async () => {
  try {
    const q = query(collection(db, "events"));
    const querySnapshot = await getDocs(q);

    const events = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();

        // Handle places_available safely
        const places_available = data.places_available != null ? data.places_available : 0;

        // Robust timestamp handling
        let date_time = null;
        if (data.date_time) {
          // Proper Firestore Timestamp
          if (typeof data.date_time.toDate === "function") {
            date_time = data.date_time.toDate();
          }
          // Raw Firestore timestamp object {_seconds, _nanoseconds}
          else if (data.date_time._seconds != null) {
            date_time = new Date(data.date_time._seconds * 1000);
          }
          // String or JS Date
          else {
            date_time = new Date(data.date_time);
          }

          // If invalid, leave as null (frontend can handle fallback)
          if (isNaN(date_time.getTime())) {
            console.warn(`Invalid date for event ${doc.id}:`, data.date_time);
            date_time = null;
          }
        }

        return {
          id: doc.id,
          ...data,
          places_available,
          date_time,
        };
      })
      // Optional: sort by date, null dates at the end
      .sort((a, b) => {
        if (!a.date_time) return 1;
        if (!b.date_time) return -1;
        return a.date_time - b.date_time;
      });

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};


export const registerForEvent = async (userId, eventId, eventPrice) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      throw new Error('Event not found');
    }
    
    const eventData = eventDoc.data();
    if (eventData.places_available <= 0) {
      throw new Error('No places available');
    }
    
    // Update event places available
    await updateDoc(eventRef, {
      places_available: increment(-1)
    });
    
    // Add event ID to user's registered events array
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // User document exists, add event to events array
      await updateDoc(userRef, {
        events: arrayUnion(eventId)
      });
    } else {
      // User document doesn't exist, create it with events array
      await setDoc(userRef, {
        events: [eventId]
      }, { merge: true });
    }
    
    return { success: true, event_id: eventId };
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

