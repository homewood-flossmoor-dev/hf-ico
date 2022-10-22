"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Wallet {
}
class Block {
    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
    get_hash() {
    }
}
class Transaction {
    constructor(amount, payer, //public key
    payee //public key
    ) {
        this.amount = amount;
        this.payer = payer;
        this.payee = payee;
    }
}
class Chain {
    constructor() {
        this.chain = [
            //GENESIS BLOCK (1ST BLOCK HARD CODED)
            new Block(0, "asdadadadasd", "asadasdadas", new Date().getTime(), new Transaction(100, "genesis", "satoshi"))
        ];
    }
}
//singleton instance
Chain.instance = new Chain();
