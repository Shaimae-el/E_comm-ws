const productContainer = document.getElementById("products");
const pagination = document.getElementById("pagination");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");

let productsData = []; // tous les produits
let filteredProducts = []; // produits après filtre
let currentPage = 1;
const limit = 9;

function loadProducts() {
  fetch("https://dummyjson.com/products?limit=100")
    .then(res => res.json())
    .then(data => {
      productsData = data.products;
      populateCategories();
      applyFilters();
    });
}

function populateCategories() {
  const categories = [...new Set(productsData.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(option);
  });
}

function applyFilters() {
  const selectedCategory = categorySelect.value;
  const sortValue = sortSelect.value;

  filteredProducts = [...productsData];

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  switch (sortValue) {
    case "az":
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "za":
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "priceAsc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "priceDesc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
  }

  currentPage = 1;
  displayProducts();
  generatePagination();
}

function resetFilters() {
  categorySelect.value = "all";
  sortSelect.value = "az";
  applyFilters();
}

function displayProducts() {
  productContainer.innerHTML = "";
  const start = (currentPage - 1) * limit;
  const pageItems = filteredProducts.slice(start, start + limit);

  pageItems.forEach(product => {
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
}

function generatePagination() {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(filteredProducts.length / limit);
  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.onclick = () => {
      currentPage = i;
      displayProducts();
      generatePagination();
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
