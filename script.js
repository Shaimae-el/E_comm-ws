const productContainer = document.getElementById("products");
const pagination = document.getElementById("pagination");
const limit = 9;
let skip = 0;

function loadProducts() {
  productContainer.innerHTML = "<p>Chargement...</p>";
  fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
    .then(res => res.json())
    .then(data => {
      productContainer.innerHTML = "";
      data.products.forEach(product => {
        productContainer.innerHTML += `
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description.substring(0, 60)}...</p>
                <p class="card-text"><strong>${product.price} $</strong></p>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Ajouter au panier</button>
              </div>
            </div>
          </div>
        `;
      });
      generatePagination(data.total);
    });
}

function generatePagination(total) {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(total / limit);
  for (let i = 0; i < pageCount; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
    li.onclick = () => {
      skip = i * limit;
      loadProducts();
    };
    pagination.appendChild(li);
  }
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.includes(id)) cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produit ajouté au panier !");
}

loadProducts();
