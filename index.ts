import * as crypto from 'crypto';

// Transfer of funds between two wallets
class Transaction {
  constructor(
    public amount: number, 
    public payer: string, // public key
    public payee: string // public key
  ) {}

  toString() {
    return JSON.stringify(this);
  }

}

// Individual block on the chain
class Block {

  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public index : number,
    public prevHash: string, 
    public transaction: Transaction, 
    public ts = Date.now()
  ) {}

  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');
  }
}


// The blockchain
class Chain {
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
  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer,payeePublicKey: string) {
    const verify = crypto.createVerify('SHA256');
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.chain.length+1,this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }

}

// Wallet gives a user a public/private keypair
class Wallet {
  public publicKey: string;
  public privateKey: string;
  public coin:number = 0;

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
  }
  readProps(){
    return this.coin;
  }

}

// Example usage

const satoshi = new Wallet();
const bob = new Wallet();
const alice = new Wallet();

satoshi.sendMoney(50, bob.publicKey);
console.log('Bob balance is', bob.readProps());