import * as crypto from 'crypto';
import Transaction from './Transaction';
import { Chain } from './Chain';

export class Wallet {
    public publicKey: string;
    public privateKey: string;
    public coin:number = 100;
  
    constructor() {
      const keypair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
  
      this.privateKey = keypair.privateKey;
      this.publicKey = keypair.publicKey;
    }
  
    sendMoney(amount: number, payeePublicKey: string) {
      const transaction = new Transaction(amount, this.publicKey, payeePublicKey);
  
      const sign = crypto.createSign('SHA256');
      sign.update(transaction.toString()).end();
  
      const signature = sign.sign(this.privateKey); 
      Chain.instance.addBlock(transaction, this.publicKey, signature,payeePublicKey);
      console.log(Chain.instance);
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