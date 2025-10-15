const productsSection = document.getElementById("products");
const cartSection = document.getElementById("cart");
const totalElement = document.getElementById("total");

let cart = [];

window.addEventListener("load", () => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    renderCart();
  }
});

produtos.forEach(produto => {
  const article = document.createElement("article");
  article.classList.add("product");
  article.innerHTML = `
    <img src="${produto.image}" alt="${produto.title}" width="150">
    <h3>${produto.title}</h3>
    <p>${produto.description}</p>
    <p><strong>€${produto.price.toFixed(2)}</strong></p>
    <p>Categoria: ${produto.category}</p>
    <p>Avaliação: ${produto.rating.rate} ⭐ (${produto.rating.count} reviews)</p>
    <button onclick="addToCart(${produto.id})">Add to cart</button>
  `;
  productsSection.appendChild(article);
});

function addToCart(id) {
  const produto = produtos.find(p => p.id === id);
  cart.push(produto);
  saveCart();
  renderCart();
}

function renderCart() {
  cartSection.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const article = document.createElement("article");
    article.classList.add("cart-item");
    article.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="100">
      <h3>${item.title}</h3>
      <p><strong>€${item.price.toFixed(2)}</strong></p>
      <button onclick="removeFromCart(${index})">Remover</button>
    `;
    cartSection.appendChild(article);
  });
  totalElement.textContent = `Total: €${total.toFixed(2)}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
