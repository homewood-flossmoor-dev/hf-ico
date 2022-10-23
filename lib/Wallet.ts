import * as crypto from 'crypto';
import Transaction from './Transaction';
import { Chain } from './Chain';

export class Wallet {
    public publicKey: string;
    public coin:number = 100;
  
    constructor(name:string) {
        this.publicKey = name
    }
  
    sendMoney(amount: number, payeePublicKey: string) {
      const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

      Chain.instance.addBlock(transaction, this.publicKey,payeePublicKey);
      this.coin -= amount;
    }
    readProps(){
      return this.coin;
    }
  
  }

export interface IWallet {
    publicKey: string;
    privateKey: string;
    coin: number;
}