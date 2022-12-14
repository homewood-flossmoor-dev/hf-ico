"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Transfer of funds between two wallets
class Transaction {
    constructor(amount, payer, // public key
    payee // public key
    ) {
        this.amount = amount;
        this.payer = payer;
        this.payee = payee;
    }
    toString() {
        return JSON.stringify(this);
    }
}
exports.default = Transaction;
