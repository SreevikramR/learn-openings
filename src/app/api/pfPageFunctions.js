import { db } from "@/firebase";
import { getDoc, doc, setDoc, collection, getDocs } from "firebase/firestore";

export async function getUID(username) {
    const docRef = doc(db, "usernames", username);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.data() !== undefined) {
        return docSnap.data().uid;
    } else {
        return false;
    }
}

export async function getAccountCreationDate(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data().accountCreationDate;
}

export async function getName(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data().name;
}