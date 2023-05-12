import { auth, db } from "@/firebase";
import { getDoc, doc, setDoc, collection, getDocs } from "firebase/firestore";

let firstName = null;
let loggedInUser = null;
let openings = [];
let openingData = [];
let previousOpeningName;
let openingLines;

export async function getfName() {
    if (loggedInUser != auth.currentUser.uid) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const packet = await getDoc(docRef);
        const data = packet.data().fName;
        firstName = data;
        loggedInUser = auth.currentUser.uid;
        return firstName;
    } else {
        return firstName;
    }
}

export async function checkUsernameExists(username) {
    const docRef = doc(db, "usernames", username);
    const data = await getDoc(docRef);
    if (data.data() == undefined) {
        return false;
    } else {
        return true;
    }
}

export async function createUser(firstName, lastName, username) {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
        fName: firstName,
        lName: lastName,
        uid: auth.currentUser.uid,
        username: username,
    });
    await setDoc(doc(db, "usernames", username), {
        uid: auth.currentUser.uid,
    });
}

export async function getLines(){
    const lines = openingLines
    console.log(lines)
    return lines;
}

export async function setFirstLine(openingName){
    if(previousOpeningName == openingName){
        return openingLines[0]
    } else {
        const docRef = doc(db, "openings", openingName);
        const packet = await getDoc(docRef);
        openingData = packet.data()
    
        openingLines = Object.keys(openingData).sort()
        console.log(openingLines)
        previousOpeningName = openingName
    }
    return openingLines[0]
}

export function getMoveSequence(openingLine){
    const line = openingData[openingLine]
    return line
}

export async function getAlternateLine(currentLine) {
    let foundLine = false;
        while (foundLine === false) {
        let index = Math.round(randomNumber(openingLines.length - 1));
        if (openingLines[index] != currentLine) {
            return openingLines[index];
        }
    }
}

export async function getAllOpenings(){
    const querySnapshot = await getDocs(collection(db, "openings"));
    openings = []
    querySnapshot.forEach((doc) => {
        openings.push(doc.id)
    });
    return openings
}

function randomNumber(max) {
    return Math.random() * max;
}