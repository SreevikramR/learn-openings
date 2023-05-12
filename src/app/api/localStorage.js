"use client"

export async function storeLocalData(key, value){
    localStorage.setItem(key, JSON.stringify(value))
}

export function getLocalStorage(key){
    let localResult = localStorage.getItem(key);
    if(localResult == null){
        return false
    } else {
        return JSON.parse(localResult)
    }
}