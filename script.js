const products = [
  {
      id: 1,
      name: "Apple iPhone 16 Pro Max",
      price: 1299.00,
      image: "./images/MYX13QNA_1_Classic.png",
      description: "Apple iPhone 16 Pro Max 512GB 5G SIM Free Smartphone - White Titanium",
  },
  {
      id: 2,
      name: "Apple iPad Wi-Fi Tablet",
      price: 249,
      image: "./images/MK2K3LLA_1_Supersize.jpg",
      description: "Apple iPad 2021 10.2 Space Grey 64GB Wi-Fi Tablet - Global Spec",
  },
  {
      id: 3,
      name: "Apple MacBook Air",
      price: 649.97,
      image: "./images/A1MGN63BA_1_7781349_LargeProductImage.jpg",
      description: "Apple MacBook Air 13.3 Inch M1 8GB RAM 256GB SSD - Space Grey",
  },
  {
      id: 4,
      name: "Microsoft Surface 7 Snapdragon",
      price: 1999.00,
      image: "./images/ZIR-00003_1_Supersize.png",
      description: "Microsoft Surface 7 Snapdragon X Elite 16GB RAM 1TB SSD 13.8 Inch Touchscreen Windows 11 Pro Laptop",
  },
  {
      id: 5,
      name: "Fujitsu LIFEBOOK A3511",
      price: 388.93,
      image: "./images/61yWngjvgWL._AC_UL480_QL65_.jpg",
      description: "Fujitsu LIFEBOOK A3511 Intel Core i3-1115G4 15.6 FHD Display 8GB DDR4-SDRAM 256GB SSD Wi-Fi 6 (802.11ax) Windows 11 Pro",
  },
];

const cart = [];

// Toggle Cart Visibility
function toggleCart() {
  const cartContainer = document.getElementById("cart-container");
  const productContainer = document.getElementById("products-container");

  if (window.innerWidth <= 768) {
      // For small screens, toggle cart or product list
      const isCartVisible = cartContainer.style.display === "block";
      cartContainer.style.display = isCartVisible ? "none" : "block";
      productContainer.style.display = isCartVisible ? "block" : "none";
  } else {
      // For larger screens, just toggle the cart
      cartContainer.style.display = cartContainer.style.display === "none" ? "block" : "none";
      productContainer.style.display = "block"; // Always show products
  }
}

// Add product to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
      existingItem.quantity++;
  } else {
      cart.push({ ...product, quantity: 1 });
  }

  displayCart();
  updateCartIcon();
  showToast(`${product.name} has been added to the cart`);
}

// Display cart items
function displayCart() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
      total += item.price * item.quantity;

      const cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("cart-item");
      cartItemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}" />
          <div class="item-details">
              <h4>${item.name}</h4>
              <p>$${item.price.toFixed(2)} x <span>${item.quantity}</span></p>
              <div class="quantity-controls">
                  <button class="decrease" onclick="updateQuantity(${item.id}, -1)">-</button>
                  <span>${item.quantity}</span>
                  <button class="increase" onclick="updateQuantity(${item.id}, 1)">+</button>
              </div>
          </div>
          <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
      `;
      cartContainer.appendChild(cartItemDiv);
  });

  document.getElementById("cart-total").innerText = `$${total.toFixed(2)}`;
  const checkoutButton = document.getElementById("checkout-button");
  const checkoutMessage = document.getElementById("checkout-message");

  checkoutButton.disabled = total === 0;
  checkoutMessage.style.display = total === 0 ? "block" : "none";

  updateCartIcon();
}

// Remove an item from the cart
function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
      cart.splice(index, 1);
  }
  displayCart();
}

// Update item quantity in the cart
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
          cart.splice(cart.indexOf(item), 1);
      }
  }
  displayCart();
  updateCartIcon();
}

// Update the cart icon count
function updateCartIcon() {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").innerText = cartCount;
}

// Show a toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
      toast.classList.remove("show");
  }, 3000);
}

// Display product list
function displayProducts() {
  const productContainer = document.getElementById("product-list");
  products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-details">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <p><strong>$${product.price.toFixed(2)}</strong></p>
          </div>
          <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productContainer.appendChild(productDiv);
  });
}

// Initial product display
displayProducts();

// Add event listener for cart icon click
document.querySelector(".cart-icon a").addEventListener("click", (e) => {
  e.preventDefault();
  toggleCart();
});


// Declare a variable to track the applied promo code
let appliedPromoCode = null;
let currentDiscount = 0;

function applyPromoCode() {
  const promoInput = document.getElementById("promo-code").value.trim().toLowerCase();
  const promoMessage = document.getElementById("promo-message");
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Reset discount and promo message
  currentDiscount = 0;
  promoMessage.style.display = "none";

  if (!promoInput) {
    appliedPromoCode = null;
    updateCartSummary(subtotal, currentDiscount);
    return;
  }

  // Validate promo code
  if (promoInput === "ostad10" && appliedPromoCode !== "ostad10") {
    currentDiscount = subtotal * 0.10;
    appliedPromoCode = "ostad10";
    promoMessage.textContent = "Promo code 'ostad10' applied successfully!";
    promoMessage.style.color = "green";
    promoMessage.style.display = "block";
  } else if (promoInput === "ostad5" && appliedPromoCode !== "ostad5") {
    currentDiscount = subtotal * 0.05;
    appliedPromoCode = "ostad5";
    promoMessage.textContent = "Promo code 'ostad5' applied successfully!";
    promoMessage.style.color = "green";
    promoMessage.style.display = "block";
  } else if (promoInput === appliedPromoCode) {
    promoMessage.textContent = "Promo code already applied.";
    promoMessage.style.color = "#ff4d4d";
    promoMessage.style.display = "block";
  } else {
    promoMessage.textContent = "Invalid promo code.";
    promoMessage.style.color = "#ff4d4d";
    promoMessage.style.display = "block";
  }

  // Update cart summary
  updateCartSummary(subtotal, currentDiscount);
}

function updateCartSummary(subtotal, discount) {
  const finalTotal = subtotal - discount;
  document.getElementById("cart-subtotal").innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById("cart-discount").innerText = `-$${discount.toFixed(2)}`;
  document.getElementById("cart-total").innerText = `$${finalTotal.toFixed(2)}`;

  const checkoutButton = document.getElementById("checkout-button");
  checkoutButton.disabled = cart.length === 0 || finalTotal <= 0;
}

// Call this whenever the cart updates
function onCartUpdate() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (appliedPromoCode) {
    applyPromoCode();
  } else {
    updateCartSummary(subtotal, 0);
  }
}
