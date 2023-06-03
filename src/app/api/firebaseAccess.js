import { auth, db, storage } from "@/firebase";
import { getDoc, doc, setDoc, collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { getDataLocal, storeDataLocal } from "./localStorage";

let openings = [];
let openingData = [];
let previousOpeningName;
let openingLines;
let lastChecked = 0;

export async function getName() {
    if (auth.currentUser.uid != null) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const packet = await getDoc(docRef);
        if(packet.data() === undefined) {
            return undefined;
        }
        const data = packet.data().name;
        storeDataLocal("name", data);
        return data;
    } else {
        return getDataLocal("name");
    }
}

export async function signUserOut() {
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    auth.signOut();
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

export async function getUsername() {
    if(getDataLocal("username") !== false) {
        return getDataLocal("username")
    } else {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const data = await getDoc(docRef);
        if(data.data() === undefined) {
            return undefined;
        }
        if(data.data().username !== undefined){
            storeDataLocal("username", data.data().username)
        }
        return data.data().username;
    }
}

export async function createUser(username) {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        username: username,
    });
    await setDoc(doc(db, "usernames", username), {
        uid: auth.currentUser.uid,
    });
}

export async function getLines(){
    const lines = openingLines
    return lines;
}

export async function getNumberOfVariations(openingsList){
    await versionControl();
    let numberOfVariations = [];
    for(let i=0; i<openingsList.length; i++){
        if(getDataLocal(openingsList[i] + "Data") !== false) {
            let openingData = getDataLocal(openingsList[i] + "Data")
            openingLines = Object.keys(openingData).sort()
            numberOfVariations.push(openingLines.length)
        } else {
            const docRef = doc(db, "openings", openingsList[i]);
            const packet = await getDoc(docRef);
            let openingData = packet.data()
            storeDataLocal(openingsList[i] + "Data", openingData)
    
            openingLines = Object.keys(openingData).sort()
            numberOfVariations.push(openingLines.length)
        }
    }
    return numberOfVariations;
}

export async function setFirstLine(openingName){
    await versionControl();
    if(getDataLocal(openingName + "Data") !== false) {
        openingData = getDataLocal(openingName + "Data")
        openingLines = Object.keys(openingData).sort()
        previousOpeningName = openingName
    } else {
        const docRef = doc(db, "openings", openingName);
        const packet = await getDoc(docRef);
        openingData = packet.data()
        storeDataLocal(openingName + "Data", openingData)

        openingLines = Object.keys(openingData).sort()
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
    await versionControl();
    if(getDataLocal("allOpenings") !== false){
        openings = getDataLocal("allOpenings")
    } else {
        const querySnapshot = await getDocs(collection(db, "openings"));
        openings = []
        querySnapshot.forEach((doc) => {
            openings.push(doc.id)
        });
        storeDataLocal("allOpenings", openings)
    }
    return openings
}

export async function getOpeningsData() {
    await versionControl();
    if(getDataLocal("openingsData") !== false){
        let openingsData;
        openingsData = getDataLocal("openingsData")
        return openingsData
    } else {
        const querySnapshot = await getDocs(collection(db, "openingsData"));
        let openingsData = {};
        querySnapshot.forEach((doc) => {
            openingsData[doc.id] = doc.data()
        })
        storeDataLocal("openingsData", openingsData)
        return openingsData
    }
}

export async function openingLineCompleted(openingName, openingLine, color, mode) {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const packet = await getDoc(docRef);
    let data = packet.data();
    if(data[color + "_" + mode] === undefined){
        let completedOpenings = [];
        let openingCode = await getOpeningVariationCode(openingName, openingLine)
        completedOpenings.push(openingCode)
        if(mode === "learn") {
            if(color === "white"){
                setDoc(docRef, {white_learn: completedOpenings}, {merge: true});
            } else {
                setDoc(docRef, {black_learn: completedOpenings}, {merge: true});
            }
        } else {
            if(color === "white"){
                setDoc(docRef, {white_train: completedOpenings}, {merge: true});
            } else {
                setDoc(docRef, {black_train: completedOpenings}, {merge: true});
            }
        }
    } else {
        let openingCode = await getOpeningVariationCode(openingName, openingLine)
        if(mode === "learn") {
            if(color === "white") {
                let completedOpenings = data.white_learn;
                if(completedOpenings.includes(openingCode)){
                    return
                }
                completedOpenings.push(openingCode)
                setDoc(docRef, {white_learn: completedOpenings}, {merge: true});
            } else {
                let completedOpenings = data.black_learn;
                if(completedOpenings.includes(openingCode)){
                    return
                }
                completedOpenings.push(openingCode)
                setDoc(docRef, {black_learn: completedOpenings}, {merge: true});
            }
        } else {
            if(color === "white") {
                let completedOpenings = data.white_train;
                if(completedOpenings.includes(openingCode)){
                    return
                }
                completedOpenings.push(openingCode)
                setDoc(docRef, {white_train: completedOpenings}, {merge: true});
            } else {
                let completedOpenings = data.black_train;
                if(completedOpenings.includes(openingCode)){
                    return
                }
                completedOpenings.push(openingCode)
                setDoc(docRef, {black_train: completedOpenings}, {merge: true});
            }
        }
    }
}

export async function getCompletedOpenings(color, mode) {
    await versionControl();
    const docRef = doc(db, "users", auth.currentUser.uid);
    const packet = await getDoc(docRef);
    let data = packet.data();
    if(data[color + "_" + mode] === undefined){
        return []
    } else {
        storeDataLocal(color + "_" + mode, data[color + "_" + mode])
        return data[color + "_" + mode]
    }
}

export async function getCompletedOpeningVariations(openingName, mode) {
    await versionControl();
    let openingCode = await getOpeningCode(openingName);
    let variationCodes = await getAllVariationCodes(openingName);
    let completedOpenings_white = await getCompletedOpenings("white", mode);
    let completedOpeningVariations = [];
    let completedOpenings_black = await getCompletedOpenings("black", mode);
    let tempArray = [];
    for(let i = 0; i < completedOpenings_white.length; i++){
        if(completedOpenings_white[i].includes(openingCode)){
            let variationCode = completedOpenings_white[i].split("-")[1]
            tempArray.push(getKeyByValue(variationCodes, variationCode).slice(0, -5))
        }
    }
    completedOpeningVariations.push(tempArray)
    tempArray = [];
    for(let i = 0; i < completedOpenings_black.length; i++){
        if(completedOpenings_black[i].includes(openingCode)){
            let variationCode = completedOpenings_black[i].split("-")[1]
            tempArray.push(getKeyByValue(variationCodes, variationCode).slice(0, -5))
        }
    }
    completedOpeningVariations.push(tempArray)
    return completedOpeningVariations;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

async function getOpeningCode(openingName) {
    if(getDataLocal("openingCodes") !== false) {
        let openingCodes = getDataLocal("openingCodes")
        return openingCodes[openingName]
    } else {
        const docRef = doc(db, "openingsData", "openingCodes");
        const packet = await getDoc(docRef);
        let openingCodes = packet.data();
        return openingCodes[openingName]
    }
}

async function getAllVariationCodes(openingName) {
    if(getDataLocal(openingName + "Codes") !== false) {
        let openingCodes = getDataLocal(openingName + "Codes")
        return openingCodes
    } else {
        const docRef = doc(db, "openingsData", openingName);
        const packet = await getDoc(docRef);
        let openingCodes = packet.data();
        return openingCodes
    }
}

async function getOpeningVariationCode(openingName, openingLine) {
    if(getDataLocal(openingName + "Codes") !== false) {
        let openingCodes = getDataLocal(openingName + "Codes")
        return openingCodes["openingCode"] + "-" + openingCodes[openingLine + " Code"]
    } else {
        const docRef = doc(db, "openingsData", openingName);
        const packet = await getDoc(docRef);
        let openingCodes = packet.data();
        storeDataLocal(openingName + "Codes", openingCodes)
        return openingCodes["openingCode"] + "-" + openingCodes[openingLine + " Code"]
    }
}

function randomNumber(max) {
    return Math.random() * max;
}

async function versionControl() {
    if(lastChecked + 600000 < Date.now()){ //Longer than 10 minutes
        lastChecked = Date.now();
        const docRef = doc(db, "cacheControl", "cacheVersion");
        const packet = await getDoc(docRef);
        const data = packet.data().versionCode;
        if(data == getDataLocal("cacheVersion")){
            return false
        } else {
            localStorage.clear()
            storeDataLocal("cacheVersion", data)
            return true
        }
    }
}

export async function getImageURL(imgName) {
    const url = await getDownloadURL(ref(storage, imgName));
    return url;
}