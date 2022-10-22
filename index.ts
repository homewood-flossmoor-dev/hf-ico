import * as crypto from 'crypto';

class Wallet {

}

class Block{
    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: Transaction;

    constructor(index:number, hash:string, previousHash:string, timestamp:number, data:Transaction){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }

    get_hash(){

    }

}
class Transaction{
    constructor(
        public amount: number,
        public payer: string, //public key
        public payee: string //public key
    ){}
}

class Chain{
    //singleton instance
    public static instance = new Chain();
    chain: Block[];

    constructor(){
        this.chain = [
            //GENESIS BLOCK (1ST BLOCK HARD CODED)
            new Block(0,"asdadadadasd","asadasdadas",new Date().getTime(),new Transaction(100,"genesis", "satoshi"))
        ];
    }
}