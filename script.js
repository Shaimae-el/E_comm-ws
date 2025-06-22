// script.js MIS A JOUR
const productContainer = document.getElementById("products");
const pagination = document.getElementById("pagination");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");
const searchInput = document.getElementById("searchInput");

let productsData = [];
let filteredProducts = [];
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
  const searchTerm = searchInput.value.toLowerCase();

  filteredProducts = [...productsData];

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(searchTerm));
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
  searchInput.value = "";
  applyFilters();
}

function displayProducts() {
  productContainer.innerHTML = "";
  const start = (currentPage - 1) * limit;
  const pageItems = filteredProducts.slice(start, start + limit);

  if (pageItems.length === 0) {
    productContainer.innerHTML = '<p class="text-center">Aucun produit trouvé.</p>';
    return;
  }

  pageItems.forEach(product => {
    productContainer.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description.substring(0, 60)}...</p>
            <p class="card-text"><strong>${product.price} $</strong></p>
            <button class="btn btn-sm btn-outline-info mb-2" onclick="showDetails(${product.id})">Voir détails</button>
            <button class="btn btn-primary w-100" onclick="addToCart(${product.id}, 1)">Ajouter au panier</button>
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

function addToCart(id, qty = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produit ajouté au panier !");
}

function showDetails(id) {
  fetch(`https://dummyjson.com/products/${id}`)
    .then(res => res.json())
    .then(product => {
      document.getElementById("modalTitle").textContent = product.title;
      document.getElementById("modalBody").innerHTML = `
        <img src="${product.thumbnail}" class="img-fluid mb-3" style="max-height:200px; object-fit:cover;">
        <p><strong>Prix:</strong> ${product.price} $</p>
        <p><strong>Stock disponible:</strong> ${product.stock}</p>
        <p>${product.description}</p>
        <label for="quantityInput">Quantité :</label>
        <input id="quantityInput" type="number" class="form-control" value="1" min="1" max="${product.stock}" />
      `;
      document.getElementById("modalAddToCart").onclick = () => {
        const qty = parseInt(document.getElementById("quantityInput").value);
        addToCart(product.id, qty);
      };
      new bootstrap.Modal(document.getElementById("productModal")).show();
    });
}

loadProducts();
