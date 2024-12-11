const { createHash } = require("crypto");
const Block = require("./block");
const BlockModel = require("../models/blockModel");

class Blockchain {
    constructor() {
        this.chain = [];
        this.height = -1;
    }

    async initializeChain() {
        const genesisBlock = await BlockModel.findOne({ height: 0 });
        if (!genesisBlock) {
            const block = new Block({ data: 'Genesis Block' });
            await this.addBlock(block);
        } else {
            await this.loadChainFromDatabase();
        }
    }

    async addBlock(block) {
        const lastBlock = await BlockModel.findOne().sort({ height: -1 });
        block.height = lastBlock ? lastBlock.height + 1 : 0;
        block.previousBlockHash = lastBlock ? lastBlock.hash : null;

        block.hash = createHash('sha256')
            .update(JSON.stringify(block))
            .digest('hex');

        const savedBlock = await BlockModel.create({
            hash: block.hash,
            height: block.height,
            body: block.body,
            time: block.time,
            previousBlockHash: block.previousBlockHash,
        });

        this.chain.push(savedBlock);
        this.height = block.height;
        return savedBlock;
    }

    async loadChainFromDatabase() {
        this.chain = await BlockModel.find().sort({ height: 1 });
        this.height = this.chain.length - 1;
    }

    printChain() {
        this.chain.forEach(block => console.log(JSON.stringify(block, null, 2)));
    }
}

module.exports = Blockchain;