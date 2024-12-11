// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract productTrace { 

    uint256 public counter = 0;

    struct Product {
        uint256 id;
        string product;
        string process;
        string code;
        string batch;
        string location;
        string description;
        bool done;
        uint256 createdAt;
    }

    event productCreated (
        uint256 id,
        string product,
        string process,
        string code,
        string batch,
        string location,
        string description,
        bool done,
        uint256 createdAt
    );

    event ToggledDone(uint256 id, bool done);

    mapping(uint256 => Product) public products;

    constructor() {
        createProduct("Cacao", "Plantacion", "8090", "20", "Cali-Colombia, Hacienda Cacao", "Ejemplo");
    }

    function createProduct(string memory _product, string memory _process, string memory _code, string memory _batch,
    string memory _location, string memory _description) public
    
    {
        counter++;
        products[counter] = Product(
            counter,
            _product,
            _process,
            _code,
            _batch,
            _location,
            _description,
            false,
            block.timestamp);
            
        emit productCreated(
            counter, 
            _product,
            _process,
            _code,
            _batch,
            _location,
            _description,
            false,
            block.timestamp);
            
    }

    function toggleDone(uint256 _id) public {
        Product memory _prod = products[_id];
        _prod.done = !_prod.done;
        products[_id] = _prod;
        emit ToggledDone(_id, _prod.done);
    }
}