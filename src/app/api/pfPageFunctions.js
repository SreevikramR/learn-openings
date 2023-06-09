import { db } from "@/firebase";
import { getDoc, doc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { auth } from "@/firebase";
import { getUsername } from "./firebaseAccess";

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

export async function resetUserData() {
    const docRef = doc(db, "users", auth.currentUser.uid)
    try {
        await updateDoc(docRef, {
            white_learn: deleteField(),
            black_learn: deleteField(),
            white_train: deleteField(),
            black_train: deleteField(),
        })
        return true
    }
    catch (e) {
        return e
    }
}

export async function deleteUserData() {
    const docRef = doc(db, "users", auth.currentUser.uid)
    const username = await getUsername()
    const docRef2 = doc(db, "usernames", username)
    try {
        await deleteDoc(docRef2)
        await deleteDoc(docRef)
        await deleteUser(auth.currentUser)
        return true
    }
    catch (e) {
        return(e)
    }
}