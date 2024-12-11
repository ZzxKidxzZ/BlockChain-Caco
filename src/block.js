const { createHash } = require('crypto');
const hex2ascii = require('hex2ascii');

class Block {
    constructor(data) {
        this.hash = null;
        this.height = 0;
        this.body = Buffer.from(JSON.stringify(data)).toString('hex');
        this.time = new Date().getTime().toString();
        this.previousBlockHash = null;
    }

    // Valida si el hash del bloque es correcto
    async validate() {
        const newHash = createHash('sha256')
            .update(JSON.stringify({ ...this, hash: null }))
            .digest('hex');
        return this.hash === newHash;
    }

    // Obtiene los datos del bloque (decodificados de hex)
    async getBlockData() {
        return JSON.parse(hex2ascii(this.body));
    }
}

module.exports = Block;
