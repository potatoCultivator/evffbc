import { firestore } from '../firebase'; // Adjust the path as necessary
import { collection, getDocs, onSnapshot, query, where, writeBatch, doc, runTransaction, arrayUnion, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

  function getOnlineRegStatus(callback) {
    const collectionRef = collection(firestore, 'onlineregstatus');
    
    return onSnapshot(collectionRef, 
      (snapshot) => {
        if (!snapshot.empty) {
          // Get the first document from the collection
          const doc = snapshot.docs[0];
          callback(doc.data().activate);
        } else {
          console.log('No online registration status documents found');
          callback(false); // Default to disabled if no documents exist
        }
      },
      (error) => {
        console.error('Error getting online registration status:', error);
        callback(false); // Default to disabled on error
      }
    );
  }

  async function uploadBatchConferees(conferees) {
    try {
      const batch = writeBatch(firestore);
      const confereeRef = collection(firestore, 'conferee');
  
      // Log the incoming data for debugging
      console.log('Uploading batch data:', conferees);
  
      conferees.forEach(conferee => {
        const newDocRef = doc(confereeRef);
        const confereeData = {
          name: conferee.name,
          church: conferee.church,
          sector: conferee.sector,
          gender: conferee.gender,
          organization: conferee.organization,
          email: conferee.email,
          reference_code: conferee.referenceCode,
          status: 'pending',
          reg_type: 'online',
          has_id: true,
          date_added: new Date(),
          
        };
        
        // Log each document being added
        console.log('Adding document:', confereeData);
        batch.set(newDocRef, confereeData);
      });
  
      await batch.commit();
      console.log('Batch upload completed successfully');
      return true;
    } catch (error) {
      console.error('Error in batch upload:', error);
      throw error;
    }
  }

  async function uploadBatchConfereesOnsite(conferees) {
    try {
      const batch = writeBatch(firestore);
      const confereeRef = collection(firestore, 'conferee');
  
      // Log the incoming data for debugging
      console.log('Uploading batch data:', conferees);
  
      conferees.forEach(conferee => {
        const newDocRef = doc(confereeRef);
        const confereeData = {
          name: conferee.name,
          church: conferee.church,
          sector: conferee.sector,
          gender: conferee.gender,
          organization: conferee.organization,
          email: conferee.email,
          status: 'pending',
          reg_type: 'onsite',
          has_id: false,
          date_added: new Date(),
          
        };
        
        // Log each document being added
        console.log('Adding document:', confereeData);
        batch.set(newDocRef, confereeData);
      });
  
      await batch.commit();
      console.log('Batch upload completed successfully');
      return true;
    } catch (error) {
      console.error('Error in batch upload:', error);
      throw error;
    }
  }

export { getOnlineRegStatus, uploadBatchConferees, uploadBatchConfereesOnsite };

