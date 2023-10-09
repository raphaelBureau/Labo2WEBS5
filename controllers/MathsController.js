import Controller from './Controller.js';
import fs from 'fs';
import path from 'path';

export default class MathsController {
    constructor(HttpContext) {
        this.context = HttpContext;
    }
    get() {

        let payload = this.context.payload;
        if (payload != null && payload.op != null) {
            let result = {};

            let multi = [' ', '-', '*', '/', '%'];

            if (multi.includes(payload.op)) {
                let x, y;
                if (payload.x != null && !Number.isNaN(parseFloat(payload.x))) {
                    x = parseFloat(payload.x);
                }
                else {
                    if (payload.X != null && !Number.isNaN(parseFloat(payload.X))) {
                        x = parseFloat(payload.X);
                    }
                }
                if (payload.y != null && !Number.isNaN(parseFloat(payload.y))) {
                    y = parseFloat(payload.y);
                }
                else {
                    if (payload.Y != null && !Number.isNaN(parseFloat(payload.Y))) {
                        y = parseFloat(payload.Y);
                    }
                }
                result.x = x;
                result.y = y;
                result.op = payload.op;
                if (result.op == ' ') {
                    result.op = '+';
                }
                switch (payload.op) {
                    case ' ': //addition+  encodé URI donc espace  (x number, y number)
                        result.value = x + y;
                        console.log("addition " + result.value);
                        this.context.response.created(result);
                        return;

                    case '-': //soustraction (x number, y number)
                        result.value = (x - y);
                        console.log("soustraction " + result.value);
                        this.context.response.created(result);
                        return;


                    case '*': //multiplication (x number, y factor)
                        result.value = x * y;
                        console.log("multiplication " + result.value);
                        this.context.response.created(result);
                        return;


                    case '/': //division (x number, y factor)  division par 0 watch out
                        if (y != 0) {
                            result.value = x / y;
                            console.log("division " + result.value);
                            this.context.response.created(result);
                            return;
                        }
                        this.context.response.unprocessable("le parametre y ne doit pas etre egal a 0");
                        return;

                    case '%': //modulo (x number, y mod) //division par 0
                        if (y != 0) {
                            result.value = x % y;
                            console.log("modulo " + result.value);
                            result.x = x;
                            result.y = y;
                            result.op = "%";
                            this.context.response.created(result);
                            return;
                        }
                        this.context.response.unprocessable("le parametre y ne doit pas etre egal a 0");
                        return;

                }
            }

            let single = ['!', 'p', 'np'];

            if (single.includes(payload.op)) {
                let n;
                if (payload.n != null && !Number.isNaN(parseFloat(payload.n))) {
                    n = parseFloat(payload.n);
                }
                else {
                    if (payload.N != null && !Number.isNaN(parseFloat(payload.N))) {
                        n = parseFloat(payload.N);
                    }
                }
                result.op = payload.op;
                result.n = payload.n;
                switch (payload.op) {
                    case '!': //factoriel (x number) //nombre doit etre positif
                                if (n > 0) {
                                    if (parseInt(n) == parseFloat(n)) {
                                        function factoriel(n) {
                                            if (n == 0 || n == 1) {
                                                return 1;
                                            } else {
                                                return n * factoriel(n - 1);
                                            }
                                        }
                                        result.value = factoriel(parseInt(n));
                                        this.context.response.created(result);
                                        console.log("factoriel " + result.value);
                                        return;
                                    }
                                    this.context.response.unprocessable("le parametre x doit etre un entier");
                                    return;
                                }
                                this.context.response.unprocessable("le parametre x ne doit pas etre egal ou plus petit que 0");
                                return;
                    case 'p': //premier (x number) bool isPrime
                                if (parseInt(n) > 0) {
                                    if (parseInt(n) == parseFloat(n)) {
                                        function IsPrime(n) {
                                            for (let i = 2; i < (n + 1) / i; i++) { //wow efficacité, copyright intelligence raphael 2021
                                                if (n % i == 0) {
                                                    return false;
                                                }
                                            }
                                            if (n > 1) {
                                                return true;
                                            }
                                            return false;
                                        }
                                        result.value = IsPrime(parseInt(payload.n));
                                        console.log("premier " + result.value);
                                        this.context.response.created(result);
                                        return;
                                    }
                                    this.context.response.unprocessable("le parametre x doit etre un entier");
                                    return;
                                }
                                this.context.response.unprocessable("le parametre x ne doit pas etre egal ou plus petit que 0");
                                return;
                    case 'np': //premier (x number) retourne le nieme premier | server benchmark lol
                                if (parseInt(n) > 0) {
                                    if (parseInt(n) == parseFloat(n)) {
                                        function FindPrime(n) { //n = nième prime
                                            let primeCount = 0;
                                            for (let j = 2; j < 10000; j++) {
                                                let prime = true;
                                                for (let i = 2; i < (j + 1) / i; i++) { //wow efficacité, copyright intelligence raphael 2021
                                                    if (j % i == 0) {
                                                        prime = false;
                                                        break;
                                                    }
                                                }
                                                if (prime) {
                                                    primeCount++;
                                                    if (primeCount == n) {
                                                        return (j);
                                                    }
                                                }
                                            }
                                            return (-1);
                                        }
                                        result.value = FindPrime(parseInt(n));
                                        if (result.value == -1) {
                                            this.context.response.unprocessable("le n'ieme premier est au dessus de 10000, la requete est cancellée");
                                            return;
                                        }
                                        this.context.response.created(result);
                                        console.log("nmieme premier " + result.value);
                                        return;
                                    }
                                    this.context.response.unprocessable("le parametre x doit etre un entier");
                                    return;
                                }
                                this.context.response.unprocessable("le parametre x ne doit pas etre egal ou plus petit que 0");
                                return;
                }
            }
        }
        if(this.context.path.params != null) {
        if(payload != null) {
            let res = this.context.path.params;
            res.error = "op parameter missing";
            console.log();
            this.context.response.created(res);
            return;
        }
        let content = fs.readFileSync(path.join(process.cwd(), wwwroot, 'MathDoc.html'));
        this.context.response.content('text/html', content);
        return;
    }
        //response.created("documentation");
        //response.unprocessable("parametres manquants");
    }
    post() {
        this.get();
    }
    put() {
        this.get();
    }
    remove() {
        this.get();
    }
}