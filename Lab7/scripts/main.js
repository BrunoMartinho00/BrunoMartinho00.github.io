const productsSection = document.getElementById("products");
const cartSection = document.getElementById("cart");
const totalElement = document.getElementById("total");

let cart = [];
let produtos = [];

// Carrega carrinho do localStorage ao iniciar
window.addEventListener("load", () => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    renderCart();
  }

  // Busca produtos via fetch (AJAX)
  fetchProducts();
  fetchCategories();
  // Liga pesquisa em tempo real
  const searchBox = document.getElementById('searchBox');
  if (searchBox) {
    searchBox.addEventListener('input', () => {
      const filtered = applyFilters();
      renderProducts(filtered);
    });
  }
});

// Lê filtros (search, category, sort) e retorna a lista filtrada
function applyFilters() {
  const search = document.getElementById('searchBox')?.value.trim().toLowerCase() || '';
  const category = document.getElementById('categoryFilter')?.value || '';
  let list = produtos.slice();
  if (category) list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  if (search) list = list.filter(p => (p.title || '').toLowerCase().includes(search));
  return list;
}

async function fetchProducts() {
  try {
    const res = await fetch('https://deisishop.pythonanywhere.com/products');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    produtos = await res.json();
    renderProducts();
  } catch (err) {
    console.error('Erro a obter produtos:', err);
    productsSection.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
  }
}

async function fetchCategories() {
  try {
    const res = await fetch('https://deisishop.pythonanywhere.com/categories');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const categoriesRaw = await res.json();
    // Normaliza resposta: aceita array de strings ou array de objetos
    const categories = Array.isArray(categoriesRaw)
      ? categoriesRaw.map(c => (typeof c === 'string' ? c : (c.name || c.title || c.slug || c.category || JSON.stringify(c))))
      : [];
    populateCategoryFilter(categories);
  } catch (err) {
    console.error('Erro a obter categorias:', err);
  }
}

function populateCategoryFilter(categories) {
  const select = document.getElementById('categoryFilter');
  if (!select) return;
  // Limpa opções (mantém a opção Todas)
  select.innerHTML = '<option value="">Todas</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
  select.addEventListener('change', () => {
    const cat = select.value;
    const filtered = applyFilters();
    renderProducts(filtered);
  });

  // Liga o select de ordenação (se existir)
  const sortSelect = document.getElementById('sortOrder');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const filtered = applyFilters();
      renderProducts(filtered);
    });
  }
}

function renderProducts(list = produtos) {
  // Aplica ordenação segundo a seleção
  const sortSelect = document.getElementById('sortOrder');
  let listToRender = Array.from(list);
  const sortVal = sortSelect?.value;
  if (sortVal === 'asc') {
    listToRender.sort((a, b) => a.price - b.price);
  } else if (sortVal === 'desc') {
    listToRender.sort((a, b) => b.price - a.price);
  }

  productsSection.innerHTML = '';
  listToRender.forEach(produtoItem => {
    const article = document.createElement("article");
    article.classList.add("product");
    article.innerHTML = `
      <img src="${produtoItem.image}" alt="${produtoItem.title}" width="150">
      <h3>${produtoItem.title}</h3>
      <p>${produtoItem.description}</p>
      <p><strong>€${produtoItem.price.toFixed(2)}</strong></p>
      <p>Categoria: ${produtoItem.category}</p>
      <p>Avaliação: ${produtoItem.rating?.rate ?? '-'} ⭐ (${produtoItem.rating?.count ?? 0} reviews)</p>
      <button data-id="${produtoItem.id}" class="add-to-cart">Add to cart</button>
    `;
    productsSection.appendChild(article);
  });

  // Liga os botões de adicionar ao carrinho
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

function addToCart(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
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
      <button data-index="${index}" class="remove-from-cart">Remover</button>
    `;
    cartSection.appendChild(article);
  });
  totalElement.textContent = `Total: €${total.toFixed(2)}`;

  // Liga os botões de remover
  document.querySelectorAll('.remove-from-cart').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.index)));
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Envia o carrinho para a API via POST
async function placeOrder() {
  const cartToSend = cart.slice();
  if (!cartToSend.length) {
    alert('O carrinho está vazio.');
    return;
  }
  const data = {
    products: cartToSend.map(i => i.id),
    student: !!document.getElementById('studentCheckbox')?.checked,
    coupon: document.getElementById('coupon')?.value || '',
    name: document.getElementById('buyerName')?.value || ''
  };

  try {
    const resp = await fetch('https://deisishop.pythonanywhere.com/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resultEl = document.getElementById('orderResult');
    if (resp.status === 200) {
      const json = await resp.json();
      // Determina se o pedido incluiu algum desconto (student ou coupon)
      const usedDiscount = !!data.student || (!!data.coupon && data.coupon.trim() !== '');
      const totalLabel = usedDiscount ? 'Total (com desconto)' : 'Total';
      const msg = `${totalLabel}: €${json.totalCost} — Referência: ${json.reference}\n${json.example}`;
      if (resultEl) {
        // mostra em linhas separadas para melhor leitura
        resultEl.innerText = msg;
      }
      // Limpa carrinho e atualiza interface
      cart = [];
      saveCart();
      renderCart();
    } else if (resp.status === 400 || resp.status === 405) {
      const json = await resp.json().catch(() => ({ error: 'Erro' }));
      if (resultEl) resultEl.textContent = `Erro: ${json.error || 'Dados inválidos'}`;
    } else {
      const txt = await resp.text().catch(() => '');
      if (resultEl) resultEl.textContent = `Erro inesperado: ${resp.status} ${txt}`;
    }
  } catch (err) {
    console.error('Erro ao enviar encomenda:', err);
    const resultEl = document.getElementById('orderResult');
    if (resultEl) resultEl.textContent = 'Erro de rede ou CORS. Verifica a consola.';
  }
}

// Liga botão de checkout
document.getElementById('checkoutBtn')?.addEventListener('click', placeOrder);
