App = {
  contracts: {},

  init: async () => {
    console.log("Loaded");
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContracts();
    App.render();
    await App.renderProduct();
  },

  loadWeb3: async () => {
    // Conexion con MetaMask

    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("successful connection");
    } else if (web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask"
      );
    }
  },

  loadAccount: async () => {
    //Carga de cuenta, identificador de cuenta que crea el producto
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
    App.account = accounts[0];
  },

  loadContracts: async () => {
    //Carga de contrato al Front

    const response = await fetch("productTrace.json"); //Conversion a formato JSON
    const productTraceJSON = await response.json();
    console.log(productTraceJSON);

    App.contracts.productsContract = TruffleContract(productTraceJSON); //Conversion a truffle

    App.contracts.productsContract.setProvider(App.web3Provider); //Conexion con MetaMask

    App.productsContract = await App.contracts.productsContract.deployed(); //Despliegue del contrato
  },

  render: () => {
    //Numero de cuenta blockchain
    document.getElementById("account").innerText = App.account;
  },

  renderProduct: async () => {
    //Listado informacion Blockchain en la vista y boton toggle actualizador de estado

    const counter = await App.productsContract.counter();
    const counterNumber = counter.toNumber();
    console.log(counterNumber);

    let html = "";

    for (let i = 1; i <= counterNumber; i++) {
      const prod = await App.productsContract.products(i);
      console.log(prod);

      const _id = prod[0];
      const _product = prod[1];
      const _process = prod[2];
      const _code = prod[3];
      const _batch = prod[4];
      const _location = prod[5];
      const _description = prod[6];
      const _done = prod[7];
      const _createdAt = prod[8];

      let prodElement = `

        <div class="card bg-light mb-2">
          <div class="card-header d-flex justify-content-between align-items-center bg-white" >
              <h5>${_product}</h5>
              <div class="form-check form-switch">
              <input class="form-check-input" data-id="${_id}" type="checkbox" ${_done && "checked"} 
                onchange="App.toggleDone(this)"              
              />

              </div>
          </div>


          <div class="card-body">
              <span class="text_card">Proceso:  ${_process}</span><br>
              <span class="text_card">Codigo: ${_code}</span><br>
              <span class="text_card">Lote: ${_batch}</span><br>
              <span class="text_card">Ubicacion: ${_location}</span><br>
              <span class="text_card">Descripcion: ${_description}</span>
              </div>
              <div class="card-footer text-muted">
              <p class"text-secondary">Product was created ${new Date(_createdAt * 1000).toLocaleString()}</p>
              </div>
              </div>

      `;
      html += prodElement;
    }

    document.querySelector("#productsList").innerHTML = html;
  },

  created: async (product, process, code, batch, location, description) => {
    //Envio de la informacion y confirmacion de transaccion

    const result = await App.productsContract.createProduct(
      product,
      process,
      code,
      batch,
      location,
      description,
      {
        from: App.account,
      }
    );
    console.log(result.logs[0].args);

    window.location.reload();
  },

  toggleDone: async (element) => {
    //Metodo para cambiar el estado del producto
    console.log(element.dataset.id);
    const prodId = element.dataset.id;
    await App.productsContract.toggleDone(prodId, {
      from: App.account,
    });
    window.location.reload();
  },
};
