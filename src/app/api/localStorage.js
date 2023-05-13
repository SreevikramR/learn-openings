"use client"

export async function storeDataLocal(key, value){
    localStorage.setItem(key, JSON.stringify(value))
}

export function getDataLocal(key){
    let localResult = localStorage.getItem(key);
    if(localResult == null){
        return false
    } else {
        return JSON.parse(localResult)
    }
}