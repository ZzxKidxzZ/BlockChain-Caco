
  const productForm = document.querySelector("#productForm")

  document.addEventListener("DOMContentLoaded", ()=> {
        App.init()
  })

  productForm.addEventListener("submit", e =>{
    e.preventDefault()

        App.created(
            productForm["product"].value,
            productForm["process"].value,
            productForm["code"].value,
            productForm["batch"].value,
            productForm["location"].value,
            productForm["description"].value 
        );
  })