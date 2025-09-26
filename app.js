// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

    // --- SHARED FUNCTIONALITY ---
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    };

    // --- HOME PAGE (`index.html`) ---
    if (document.querySelector('.product-grid')) {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const product = {
                    id: card.dataset.id,
                    name: card.querySelector('h3').textContent,
                    price: parseFloat(card.querySelector('.price').textContent.replace('₹', '')),
                    image: card.querySelector('img').src,
                    quantity: 1
                };

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingProduct = cart.find(item => item.id === product.id);

                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    cart.push(product);
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                alert(`${product.name} has been added to your cart!`);
                updateCartCount();
            });
        });
    }

    // --- CART PAGE (`cart.html`) ---
    if (document.getElementById('cart-items-container')) {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalElement = document.getElementById('cart-total');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const renderCart = () => {
            cartItemsContainer.innerHTML = '';
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
                cartTotalElement.textContent = '₹0.00';
                return;
            }

            let total = 0;
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>Price: ₹${item.price.toFixed(2)}</p>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" data-index="${index}">&times;</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });

            cartTotalElement.textContent = `₹${total.toFixed(2)}`;

            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const indexToRemove = parseInt(e.target.dataset.index);
                    cart.splice(indexToRemove, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart(); // Re-render the cart
                    updateCartCount();
                });
            });
        };

        renderCart();
    }
    
    // --- REGISTER PAGE (`register.html`) ---
    const registerForm = document.getElementById('register-form');
    if(registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            
            // NOTE: Storing passwords in localStorage is NOT secure. This is for demo purposes only.
            const user = { username, email, password };
            localStorage.setItem('user', JSON.stringify(user));
            
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        });
    }

    // --- LOGIN PAGE (`login.html`) ---
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const storedUser = JSON.parse(localStorage.getItem('user'));
            
            if (!storedUser) {
                alert('No user registered. Please register first.');
                return;
            }
            
            if (storedUser.email === email && storedUser.password === password) {
                alert('Login successful!');
                window.location.href = 'index.html'; // Redirect to home page
            } else {
                alert('Invalid email or password.');
            }
        });
    }
    
    // Initial call to set cart count on page load
    updateCartCount();
});
