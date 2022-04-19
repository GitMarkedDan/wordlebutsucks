"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validGuesses_1 = require("./constants/validGuesses");
const wordlist_1 = require("./constants/wordlist");
const express = require("express");
const fs = require("fs");
const { readFile } = fs.promises;
const { readFileSync } = fs;
const app = express();
const generateToken = () => {
    const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from({ length: 20 }, (v, k) => chars[Math.floor(Math.random() * chars.length)]);
    let randomString = randomArray.join("");
    if (ActiveGames.hasOwnProperty(randomString))
        randomString = generateToken();
    return randomString;
};
const ActiveGames = {};
class game {
    constructor() {
        this.token = generateToken();
        this.answer = wordlist_1.wordList[Math.floor(Math.random() * wordlist_1.wordList.length)];
        console.log(this.answer);
        this.guesses = [];
        ActiveGames[this.token] = this;
        this.timeout = setTimeout(this.destroy, 600000);
    }
    update() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.destroy, 600000);
    }
    destroy() {
        ActiveGames[this.token] = null;
        delete ActiveGames[this.token];
    }
    guess(input) {
        if (this.guesses.length > 6) {
            this.destroy();
            throw new Error("how did this happen?");
        }
        if (input.length != 5)
            throw new Error(input + " is not 5 letters long!");
        if (input == this.answer) {
            this.destroy();
            return true;
        } //checks if its the right word
        const hint = [];
        for (let i = 0; i < 5; i++) {
            const letter = this.answer.indexOf(input.charAt(i));
            if (this.answer.charAt(i) == input.charAt(i))
                hint.push(2); // checks for green
            else if (this.answer.indexOf(input.charAt(i)) == -1)
                hint.push(0); // checks if theres any other characters, if not then black
            else
                hint.push(1); // else yellow
        }
        this.guesses.push([input, hint]);
        if (this.guesses.length == 6) {
            hint.push(this.answer);
            this.destroy();
        }
        return hint;
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//const homepage = readFile("./front/lindex.html", "utf-8")
app.use(express.json());
app.use(express.static("public"));
app.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.send(yield readFile("./public/index.html", "utf-8"));
}));
app.get("/api/newgame", (request, response) => {
    response.send(new game().token);
});
app.get("/api/guess", (request, response) => {
    if (!(request.query.hasOwnProperty("guess") && typeof (request.query.guess) == "string" && request.query.guess.length == 5 && validGuesses_1.canGuess.includes(request.query.guess)))
        return response.status(400).send("Invalid guess!");
    const game = request.query.hasOwnProperty("token") && ActiveGames[request.query.token];
    if (!game)
        return response.status(400).send("Invalid token!");
    response.send(game.guess(request.query.guess));
});
app.get("/api/getgame", (request, response) => {
    const game = request.query.hasOwnProperty("token") && ActiveGames[request.query.token];
    if (!game)
        return response.status(400).send("Invalid token!");
    response.send(game.guesses);
});
app.get("/api/update", (request, response) => {
    const game = request.query.hasOwnProperty("token") && ActiveGames[request.query.token];
    if (!game)
        return response.status(400).send("Invalid token!");
    game.update();
});
app.listen(process.env.PORT || 3000, () => console.log("app ready on 3000"));
