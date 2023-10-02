import Controller from './Controller.js';
import fs from 'fs';
import path from 'path';

export default class MathsController {
    constructor(HttpContext) {
        this.context = HttpContext;
    }
    get() { //override??

        let payload = this.context.payload;
        if (payload != null && payload.op != null) {
            let result = {};
            switch (payload.op) {
                case ' ': //addition+  encodé URI donc espace  (x number, y number)
                    if (payload.x != null && payload.y != null) {
                        if (!Number.isNaN(parseFloat(payload.x)) && !Number.isNaN(parseFloat(payload.y))) {
                            result.result = parseFloat(payload.x) + parseFloat(payload.y);
                            this.context.response.created(result);
                            return;
                        }
                        this.context.response.unprocessable("le parametre x et y doivent etre un nombre");
                        return;
                    }
                    this.context.response.unprocessable("parametre manquant");
                    return;
                    break;


                case '-': //soustraction (x number, y number)
                    if (payload.x != null && payload.y != null) {
                        if (!Number.isNaN(parseFloat(payload.x)) && !Number.isNaN(parseFloat(payload.y))) {
                            result.result = parseFloat(payload.x) - parseFloat(payload.y);
                            this.context.response.created(result);
                            return;
                        }
                        this.context.response.unprocessable("le parametre x et y doivent etre un nombre");
                        return;
                    }
                    this.context.response.unprocessable("parametre manquant");
                    return;
                    break;


                case '*': //multiplication (x number, y factor)
                    if (payload.x != null && payload.y != null) {
                        if (!Number.isNaN(parseFloat(payload.x)) && !Number.isNaN(parseFloat(payload.y))) {
                            result.result = parseFloat(payload.x) * parseFloat(payload.y);
                            this.context.response.created(result);
                            return;
                        }
                        this.context.response.unprocessable("le parametre x et y doivent etre un nombre");
                        return;
                    }
                    this.context.response.unprocessable("parametre manquant");
                    return;
                    break;


                case '/': //division (x number, y factor)  division par 0 watch out
                    if (payload.x != null && payload.y != null) {
                        if (!Number.isNaN(parseFloat(payload.x)) && !Number.isNaN(parseFloat(payload.y))) {
                            if (parseFloat(payload.y) != 0) {
                                result.result = parseFloat(payload.x) / parseFloat(payload.y);
                                this.context.response.created(result);
                                return;
                            }
                            this.context.response.unprocessable("le parametre y ne doit pas etre egal a 0");
                            return;
                        }
                        this.context.response.unprocessable("le parametre x et y doivent etre un nombre");
                        return;
                    }
                    this.context.response.unprocessable("parametre manquant");
                    return;
                    break;


                case '%': //modulo (x number, y mod) //division par 0
                    if (payload.x != null && payload.y != null) {
                        if (!Number.isNaN(parseFloat(payload.x)) && !Number.isNaN(parseFloat(payload.y))) {
                            if (parseFloat(payload.y) != 0) {
                                result.result = parseFloat(payload.x) % parseFloat(payload.y);
                                this.context.response.created(result);
                                return;
                            }
                            this.context.response.unprocessable("le parametre y ne doit pas etre egal a 0");
                            return;
                        }
                        this.context.response.unprocessable("le parametre x et y doivent etre un nombre");
                        return;
                    }
                    this.context.response.unprocessable("parametre manquant");
                    return;
                    break;


                case '!': //factoriel (x number) //nombre doit etre positif
                    if (payload.x != null) {
                        if (!Number.isNaN(parseInt(payload.x))) {
                            if (parseInt(payload.x) > 0) {
                                if (parseInt(payload.x) == parseFloat(payload.x)) {
                                    function factoriel(n) {
                                        if (n == 0 || n == 1) {
                                            return 1;
                                        } else {
                                            return n * factoriel(n - 1);
                                        }
                                    }
                                    result.result = factoriel(parseInt(payload.x));
                                    this.context.response.created(result);
                                    return;
                                }
                                this.context.response.unprocessable("le parametre x doit etre un entier");
                                return;
                            }
                            this.context.response.unprocessable("le parametre x ne doit pas etre egal ou plus petit que 0");
                            return;
                        }
                        this.context.response.unprocessable("le parametre x doit etre un nombre");
                        return;
                    }
                    this.context.response.unprocessable("parametre manquant");
                    return;
                    break;
                case 'p': //premier (x number) bool isPrime
                    if (payload.x != null) {
                        if (!Number.isNaN(parseInt(payload.x))) {
                            if (parseInt(payload.x) > 0) {
                                if (parseInt(payload.x) == parseFloat(payload.x)) {
                                    function IsPrime(n) {
                                        for (let i = 2; i < (n + 1) / i; i++) { //wow efficacité, copyright intelligence raphael 2021
                                            if (n % i == 0) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    }
                                    result.result = IsPrime(parseInt(payload.x));
                                    this.context.response.created(result);
                                    return;
                                }
                                this.context.response.unprocessable("le parametre x doit etre un entier");
                                return;
                            }
                            this.context.response.unprocessable("le parametre x ne doit pas etre egal ou plus petit que 0");
                            return;
                        }
                        this.context.response.unprocessable("le parametre x doit etre un nombre");
                        return;
                    }
                    this.context.response.unprocessable("parametre manquant");
                    return;
                    break;
                case 'pn': //premier (x number) retourne le nieme premier | server benchmark lol
                    if (payload.x != null) {
                        if (!Number.isNaN(parseInt(payload.x))) {
                            if (parseInt(payload.x) > 0) {
                                if (parseInt(payload.x) == parseFloat(payload.x)) {
                                    function FindPrime(n) { //n = nième prime
                                        let primeCount = 0;
                                        for (let j = 2; j < 10000; j++) {
                                            let prime = true;
                                            for (let i = 2; i < (j + 1) / i; i++) { //wow efficacité, copyright intelligence raphael 2021
                                                if (j % i == 0) {
                                                    prime=false;
                                                    break;
                                                }
                                            }
                                                if(prime) {
                                                    primeCount++;
                                                    if (primeCount == n) {
                                                        return (j);
                                                    }
                                                }
                                        }
                                        return(-1);
                                    }
                                    result.result = FindPrime(parseInt(payload.x));
                                    if(result.result == -1){
                                        this.context.response.unprocessable("le n'ieme premier est au dessus de 10000, la requete est cancellée");
                                        return;
                                    }
                                    this.context.response.created(result);
                                    return;
                                }
                                this.context.response.unprocessable("le parametre x doit etre un entier");
                                return;
                            }
                            this.context.response.unprocessable("le parametre x ne doit pas etre egal ou plus petit que 0");
                            return;
                        }
                        this.context.response.unprocessable("le parametre x doit etre un nombre");
                        return;
                    }
                    this.context.response.unprocessable("parametre manquant");
                    return;
                    break;
            }
        }
        let content = fs.readFileSync(path.join(process.cwd(), wwwroot, 'MathDoc.html'));
        this.context.response.content('text/html', content);
        return;
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