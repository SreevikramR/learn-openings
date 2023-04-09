import { db } from './firebase';
import { collection, getDocs } from "firebase/firestore";

let openings = []

export async function openingsDataInit() {
    const querySnapshot = await getDocs(collection(db, "openings"));
    openings = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        openings.push(doc.id)
    });
    console.log(openings)
    return openings
}