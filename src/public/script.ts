/// <reference path="utils.ts" />
let row = 1
let letter = 1

let token = getCookie("token")

let ingame = true;

async function guess() {
    let guess = "" // get word the player guessed
    for (let i = 1; i < 6; i++) {
        guess = guess + findLetter(row, i).innerHTML
    }
    if (guess.length != 5) throw new Error("oi dont do that") // catch error if player has edited html
    let data = await fetch("api/guess?" + new URLSearchParams({token: token, guess: guess}))
    .then(response => {
        if (response.status == 200) return response.json() // if all is good decode
        else return response.text() // else get error
    }).then(thong => {
        if (typeof(thong) == "string") {toast(thong, 1000); return false} // toast the error
        else return thong // or just return the decoded data
    })

    if (!data) return false // toast error
    else if (data == true) return win() // win condition

    for (let i = 0; i < 5; i++) {
        update(row, i + 1, data[i])
    }

    row += 1
    if (row == 7) {
        ingame = false
        console.log(data)
        toast("The word was " + data[5], 5000)
    }
    letter = 1
}

async function newGame() {
    token = await fetch("/api/newgame").then(response => response.text())
    setCookie("token", token, 10)
}

async function getGame() {
    let data = await fetch("/api/getgame?" + new URLSearchParams({token: token}))
        .then(response => response.json())
        .catch(() => {
            clearCookie("token")
            return false
        })
    if (!data) return false
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        const element = data[i]
        for (let i_2 = 0; i_2 < 5; i_2++) {
            findLetter(row, i_2 + 1).innerHTML = element[0].charAt(i_2)
            console.log(element[1][i_2])
            update(row, i_2 + 1, element[1][i_2])
        }
        row += 1
    }
    return true
}

async function win() {
    for (let i = 0; i < 5; i++) {
        findLetter(row, i + 1).parentElement.style.backgroundColor = "green"
    }
    ingame = false
    toast("You won!", 5000)
    clearCookie("token")
}

function findLetter(r: number | string, l: number | string) {
    return document.getElementById(r.toString() + l.toString()).getElementsByTagName("p")[0]
}

(async () => {
    if (!(token && await getGame())) newGame() // just in case getGame() fails
})()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const alphabet = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"

window.addEventListener('keydown', (event) => {
    if (ingame) {
        const key = event.key.toLowerCase()
        if ((event.key == "Backspace" || event.key == "Delete") && !(letter == 1 && findLetter(row, letter).innerHTML == "")) {
            findLetter(row, letter - 1).innerHTML = ""
            letter -= 1
        } else if (letter < 6 && alphabet.includes(event.key)) {
            const lettr = findLetter(row, letter)
            anim(lettr.parentElement, "pop", 100)
            lettr.innerHTML = key
            letter += 1
        } else if (letter == 6 && event.key == "Enter") {
            guess()
        }
        letter = Math.max(1, Math.min(6, letter))
    }
})