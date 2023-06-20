import { auth, db, storage } from "@/firebase";
import { getDoc, doc, setDoc, collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { getDataLocal, storeDataLocal } from "./localStorage";

let openings = [];
let openingData = [];
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
    await auth.signOut();
}

export async function checkUsernameExists(username) {
    const name = username.toLowerCase();
    const docRef = doc(db, "usernames", name);
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
    const name = username.toLowerCase();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const date = new Date()
    let month = months[date.getMonth()];
    let day = date.getDate()
    let year = date.getFullYear()
    const creationTime = `${month} ${day}, ${year}`
    await setDoc(doc(db, "users", auth.currentUser.uid), {
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        username: name,
        accountCreationDate: creationTime,
    });
    await setDoc(doc(db, "usernames", name), {
        uid: auth.currentUser.uid,
    });
}

export async function getOpeningData(openingName) { // Returns all data about the opening - Variations, moves, etc - Alternate -> getOpeningsMetaData
    await versionControl();
    if(getDataLocal(openingName + "Data") !== false) {
        openingData = getDataLocal(openingName + "Data")
    } else {
        const docRef = doc(db, "openings", openingName);
        const packet = await getDoc(docRef);
        openingData = packet.data()
        storeDataLocal(openingName + "Data", openingData)
    }
    return openingData
}


export async function getAlternateLine(currentLine) {
    let openingLines = await getLines("Ruy Lopez");
    let foundLine = false;
        while (foundLine === false) {
        let index = Math.round(randomNumber(openingLines.length - 1));
        if (openingLines[index] != currentLine) {
            return openingLines[index];
        }
    }
}

export async function getOpeningsList(){ // Returns a list of all openings
    await versionControl();
    let openings;
    if(getDataLocal("allOpenings") !== false){
        openings = await getDataLocal("allOpenings")
    } else {
        const querySnapshot = await getDocs(collection(db, "openings"));
        openings = [];
        querySnapshot.forEach((doc) => {
            openings.push(doc.id)
        });
        storeDataLocal("allOpenings", openings)
    }
    return openings
}

export async function getAllOpeningsMetaData() {
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

export async function getAllVariationsAndMovesForOpening(openingName) { // Returns all data about the opening - Variations, moves, etc
    await versionControl();
    if(getDataLocal(openingName + "Data") !== false) {
        openingData = getDataLocal(openingName + "Data")
    } else {
        console.log(openingName)
        const docRef = doc(db, "openings", openingName);
        const packet = await getDoc(docRef);
        openingData = packet.data()
        storeDataLocal(openingName + "Data", openingData)
    }
    return openingData
}

export async function getNumberOfVariations(openingsList){
    await versionControl();
    let numberOfVariations = [];
    for(let i=0; i<openingsList.length; i++){
        let variations = await getLines(openingsList[i])
        numberOfVariations.push(variations.length)
    }
    return numberOfVariations;
}

export async function getVariationNames(openingName){
    await versionControl();
    const openingData = await getAllVariationsAndMovesForOpening(openingName);
    let openingLines = Object.keys(openingData).sort()
    return openingLines
}

export async function parseFromURL(unparsedString) {
    let tempString = unparsedString.split("%2C").join(",");
    let words = tempString.split("-");
    let parsedString = words.map((word) => { return word[0].toUpperCase() + word.substring(1)}).join(" ");
    words = parsedString.split("_");
    parsedString = words.map((word) => { return word[0].toUpperCase() + word.substring(1)}).join("-");

    return parsedString;
}

export async function stringToURL(string) {
    var str = string;
    str = str.replace('-', '_')
    str = str.replace(/\s+/g, '-').toLowerCase();
    str = str.replace(',', '%2C')
    return str;
}

export async function getMoveSequence(openingName, openingLine){
    const openingData = await getAllVariationsAndMovesForOpening(openingName)
    const line = openingData[openingLine]
    return line
}

export async function getImageURL(imgName) {
    const url = await getDownloadURL(ref(storage, imgName));
    return url;
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
    const openingCodes = await getAllVariationCodes(openingName)
    return openingCodes["openingCode"] + "-" + openingCodes[openingLine + " Code"]
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

export async function setFirstLine(openingName){
    await versionControl();
    let openingLines = await getLines(openingName);
    return openingLines[0]
}

export async function getLines(openingName){
    await versionControl();
    const openingData = await getOpeningData(openingName)
    let openingLines;
    openingLines = Object.keys(openingData).sort()
    return openingLines
}