import { navbar } from "../components/navbar.js";
import { signUP, logIn } from "../components/credentials.js";
import { footer } from "../components/footer.js";

document.getElementById("footer").innerHTML = footer();
document.getElementById("foodNavbar").innerHTML = navbar();

setTimeout(() => {
    document.querySelector("#navbarSectionFirst>img").addEventListener("click", () => {
        window.location.href = "../index.html";
    });
    document.querySelector("#profileSection").addEventListener("click", () => {
        window.location.href = "profile.html";
    });
}, 1);

// Load and display orders
function loadOrders() {
    let orders = JSON.parse(localStorage.getItem("userOrders")) || [];
    let user = JSON.parse(localStorage.getItem("successUser")) || {};
    
    // Filter orders for current user
    let userOrders = orders.filter(order => order.userId === user.email);
    
    if (userOrders.length === 0) {
        document.getElementById("noOrders").style.display = "block";
        document.getElementById("ordersList").style.display = "none";
    } else {
        document.getElementById("noOrders").style.display = "none";
        document.getElementById("ordersList").style.display = "block";
        displayOrders(userOrders);
    }
}

function displayOrders(orders) {
    let ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = "";
    
    orders.reverse().forEach(order => {
        let orderCard = document.createElement("div");
        orderCard.className = "order-card";
        
        let statusClass = getStatusClass(order.status);
        let statusText = getStatusText(order.status);
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <h3>Order #${order.orderId}</h3>
                    <p class="order-date">${new Date(order.orderDate).toLocaleDateString()} at ${new Date(order.orderDate).toLocaleTimeString()}</p>
                </div>
                <div class="order-status ${statusClass}">
                    ${statusText}
                </div>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.img}" alt="${item.food}" class="item-image">
                        <div class="item-details">
                            <h4>${item.food}</h4>
                            <p>${item.place}</p>
                            <p class="item-qty">Qty: ${item.qty || 1}</p>
                        </div>
                        <div class="item-price">₹${item.price}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-summary">
                <div class="delivery-address">
                    <strong>Delivery Address:</strong>
                    <p>${order.address.landmark}, ${order.address.cName} - ${order.address.pincode}</p>
                </div>
                <div class="order-total">
                    <div class="total-breakdown">
                        <div class="total-line">
                            <span>Items Total:</span>
                            <span>₹${order.orderTotal}</span>
                        </div>
                        <div class="total-line">
                            <span>Delivery Fee:</span>
                            <span>₹${order.deliveryFee}</span>
                        </div>
                        ${order.discount > 0 ? `
                            <div class="total-line discount">
                                <span>Discount:</span>
                                <span>-₹${order.discount}</span>
                            </div>
                        ` : ''}
                        <div class="total-line final-total">
                            <span><strong>Total Paid:</strong></span>
                            <span><strong>₹${order.finalTotal}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="order-actions">
                <button onclick="reorderItems('${order.orderId}')" class="reorder-btn">Reorder</button>
                <button onclick="viewOrderDetails('${order.orderId}')" class="details-btn">View Details</button>
            </div>
        `;
        
        ordersList.appendChild(orderCard);
    });
}

function getStatusClass(status) {
    switch(status) {
        case 'confirmed': return 'status-confirmed';
        case 'preparing': return 'status-preparing';
        case 'delivered': return 'status-delivered';
        case 'cancelled': return 'status-cancelled';
        default: return 'status-confirmed';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'confirmed': return 'Order Confirmed';
        case 'preparing': return 'Being Prepared';
        case 'delivered': return 'Delivered';
        case 'cancelled': return 'Cancelled';
        default: return 'Order Confirmed';
    }
}

// Global functions for order actions
window.reorderItems = (orderId) => {
    let orders = JSON.parse(localStorage.getItem("userOrders")) || [];
    let order = orders.find(o => o.orderId === orderId);
    
    if (order) {
        // Add all items from this order to cart
        let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
        
        order.items.forEach(item => {
            let existingItem = cartProducts.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.qty = (existingItem.qty || 1) + (item.qty || 1);
                existingItem.price = (item.price / (item.qty || 1)) * existingItem.qty;
            } else {
                cartProducts.push({...item});
            }
        });
        
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        
        let alert = document.getElementById("alert");
        alert.style.color = "white";
        alert.style.backgroundColor = "green";
        alert.style.border = "1px solid green";
        alert.innerHTML = `Items added to cart! <i class="fa-sharp fa-solid fa-circle-check"></i>`;
        alert.style.display = "block";
        
        setTimeout(() => {
            alert.style.display = "none";
            window.location.href = "cart.html";
        }, 1500);
    }
};

window.viewOrderDetails = (orderId) => {
    let orders = JSON.parse(localStorage.getItem("userOrders")) || [];
    let order = orders.find(o => o.orderId === orderId);
    
    if (order) {
        alert(`Order Details:\n\nOrder ID: ${order.orderId}\nStatus: ${getStatusText(order.status)}\nTotal: ₹${order.finalTotal}\nEstimated Delivery: ${new Date(order.estimatedDelivery).toLocaleString()}`);
    }
};

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});

// Login functionality (same as other pages)
document.getElementById("UserSIgnUpLogInModal").innerHTML = signUP() + logIn();

// User authentication and navigation setup
function showLoginNavbar() {
    let login = JSON.parse(localStorage.getItem("successUser"));
    if (login) {
        document.getElementById("userNameNav").innerText = login.name;
    }
}

showLoginNavbar();

// Add event listeners for authentication
setTimeout(() => {
    document.getElementById("dropUserButton").addEventListener("click", userDropDown);
    document.getElementById("userImage").addEventListener("click", userDropDown);
    document.getElementById("userNameNav").addEventListener("click", userDropDown);
    
    document.getElementById("signUpCloseBttn").addEventListener("click", () => {
        document.getElementById("UserSIgnUpLogInModal").style.display = "none";
        document.getElementById("logIn").style.display = "none";
        document.querySelector("body").style.overflow = "auto";
    });
    
    document.getElementById("logInCloseBttn").addEventListener("click", () => {
        document.querySelector("body").style.overflow = "auto";
        document.getElementById("UserSIgnUpLogInModal").style.display = "none";
        document.getElementById("signUp").style.display = "none";
    });
    
    document.getElementById("logInLink").addEventListener("click", () => {
        document.getElementById("signUp").style.display = "none";
        document.getElementById("logIn").style.display = "block";
    });
    
    document.getElementById("signUpLink").addEventListener("click", () => {
        document.getElementById("signUp").style.display = "block";
        document.getElementById("logIn").style.display = "none";
    });
    
    document.getElementById("logOutBttn").addEventListener("click", () => {
        localStorage.removeItem("successUser");
        location.href = "../index.html";
    });
}, 100);

function userDropDown() {
    let login = JSON.parse(localStorage.getItem("successUser"));
    if (login) {
        if (document.getElementById("dropUser").style.display == "none") {
            document.getElementById("dropUser").style.display = "grid";
        } else {
            document.getElementById("dropUser").style.display = "none";
        }
    } else {
        document.getElementById("signUp").style.display = "none";
        document.querySelector("body").style.overflow = "hidden";
        if (document.getElementById("UserSIgnUpLogInModal").style.display == "none") {
            document.getElementById("UserSIgnUpLogInModal").style.display = "block";
            document.getElementById("logIn").style.display = "block";
        } else {
            document.getElementById("UserSIgnUpLogInModal").style.display = "none";
            document.getElementById("logIn").style.display = "none";
        }
    }
}