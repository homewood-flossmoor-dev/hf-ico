import Block from "./Block";
import Transaction from "./Transaction";
import { IWallet } from "./Wallet";
import * as crypto from 'crypto';



// The blockchain
export class Chain {
    // Singleton instance
    public static instance = new Chain(); 
    chain: Block[];
  
    constructor() {
      this.chain = [
        // Genesis block
        new Block(0,'', new Transaction(100, 'genesis', 'satoshi'))
      ];
    }
  
    // Most recent block
    get lastBlock() {
      return this.chain[this.chain.length - 1];
    }
  
    // Proof of work system
    mine(nonce: number) {
      let solution = 1;
      console.log('⛏️  mining...')
  
      while(true) {
  
        const hash = crypto.createHash('MD5');
        hash.update((nonce + solution).toString()).end();
  
        const attempt = hash.digest('hex');
  
        if(attempt.substr(0,4) === '0000'){
          console.log(`Solved: ${solution}`);
          return solution;
        }
  
        solution += 1;
      }
    }
  
    // Add a new block to the chain if valid signature & proof of work is complete
    addBlock(transaction: Transaction, senderPublicKey: string,payeePublicKey: string) {
        const newBlock = new Block(this.chain.length+1,this.lastBlock.hash, transaction);
        this.mine(newBlock.nonce);
        this.chain.push(newBlock);
    }
  
  }

  export default Chain;