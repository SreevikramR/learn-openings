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

export async function getTotalNumVariations() {
    const docRef = doc(db, "openingsData", "allOpenings");
    const docSnap = await getDoc(docRef);
    return docSnap.data().numVariations;
}

export async function getCompletedVariations(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const white_learn = docSnap.data().white_learn;
    const black_learn = docSnap.data().black_learn;
    const white_train = docSnap.data().white_train;
    const black_train = docSnap.data().black_train;
    return [white_learn, black_learn, white_train, black_train];
}