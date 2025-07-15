@@ .. @@
 document.getElementById("otpConfirm").addEventListener("submit",()=>{


     event.preventDefault();

     let input1= document.getElementById("otpInput1").value;
     let input2= document.getElementById("otpInput2").value;
     let input3= document.getElementById("otpInput3").value;
     let input4= document.getElementById("otpInput4").value;

     let otp = input1+input2+input3+input4;

     
     
     
     
     
     if(otp=="1234"){
+        // Process the order
+        processOrder();
+        
         let successUser  = JSON.parse(localStorage.getItem("successUser"))||{};
         let alert = document.getElementById("alert");
         alert.style.color="white";
         alert.style.backgroundColor="green";
         alert.style.border="1px solid green";
         alert.innerHTML=`${successUser.name} Order Confirmed <i class="fa-sharp fa-solid fa-circle-check"></i>`;
         document.getElementById("UserSIgnUpLogInModal").style.display="none"
         document.querySelector("body").style.overflow="auto"
         document.getElementById("otpDiv").style.display="none";
         document.getElementById("deliveryImg").style.display="block";
         alert.style.display="block";
         setTimeout(() => {
             alert.style.display="none";
-            location.href="../index.html"
-            localStorage.removeItem("cartProducts");
-            localStorage.removeItem("couponApplied");
+            showOrderSuccess();
             document.getElementById("deliveryImg").style.display="none";
             
         }, 2500);
         
         


     }
     else{
         
         let alert = document.getElementById("alert");
         alert.style.color="white";
         alert.style.backgroundColor="rgb(224, 53, 70)";
         alert.style.border="1px solid rgb(224, 53, 70)";
         alert.innerHTML=`Wrong OTP <i class="fa-solid fa-xmark"></i>`;
         alert.style.display="block";
         setTimeout(() => {
             alert.style.display="none";

             document.getElementById("otpInput1").value="";
             document.getElementById("otpInput2").value="";
             document.getElementById("otpInput3").value="";
             document.getElementById("otpInput4").value="";

             
         }, 2500);
         
     }
     



})


+// Simple Order Processing System
+function processOrder() {
+    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
+    let userAddress = JSON.parse(localStorage.getItem("userAddressDetails")) || [];
+    let user = JSON.parse(localStorage.getItem("successUser")) || {};
+    
+    // Calculate order total
+    let orderTotal = cartProducts.reduce((total, item) => total + parseFloat(item.price), 0);
+    let deliveryFee = orderTotal >= 499 ? 0 : 52;
+    let discount = localStorage.getItem("couponApplied") == "1" ? (orderTotal * 0.1) : 0;
+    let finalTotal = orderTotal + deliveryFee - discount;
+    
+    // Create order object
+    let order = {
+        orderId: generateOrderId(),
+        userId: user.email || 'guest',
+        userName: user.name || 'Guest User',
+        items: cartProducts,
+        address: userAddress[userAddress.length - 1] || { cName: 'Default City', landmark: 'Default Address', pincode: '000000' },
+        orderTotal: orderTotal.toFixed(2),
+        deliveryFee: deliveryFee,
+        discount: discount.toFixed(2),
+        finalTotal: finalTotal.toFixed(2),
+        orderDate: new Date().toISOString(),
+        status: 'confirmed',
+        estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
+    };
+    
+    // Save order to localStorage (in real app, this would go to a database)
+    let orders = JSON.parse(localStorage.getItem("userOrders")) || [];
+    orders.push(order);
+    localStorage.setItem("userOrders", JSON.stringify(orders));
+    localStorage.setItem("currentOrder", JSON.stringify(order));
+    
+    console.log("Order processed:", order);
+}
+
+function generateOrderId() {
+    return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
+}
+
+function showOrderSuccess() {
+    let currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
+    
+    // Create order success modal
+    let successModal = document.createElement("div");
+    successModal.innerHTML = `
+        <div class="order-success-modal">
+            <div class="order-success-content">
+                <div class="success-icon">
+                    <i class="fa-solid fa-check-circle"></i>
+                </div>
+                <h2>Order Confirmed!</h2>
+                <div class="order-details">
+                    <p><strong>Order ID:</strong> ${currentOrder.orderId}</p>
+                    <p><strong>Total Amount:</strong> ₹${currentOrder.finalTotal}</p>
+                    <p><strong>Delivery Address:</strong> ${currentOrder.address.landmark}, ${currentOrder.address.cName} - ${currentOrder.address.pincode}</p>
+                    <p><strong>Estimated Delivery:</strong> ${new Date(currentOrder.estimatedDelivery).toLocaleTimeString()}</p>
+                </div>
+                <div class="order-items">
+                    <h4>Items Ordered:</h4>
+                    ${currentOrder.items.map(item => `
+                        <div class="order-item">
+                            <span>${item.food} (${item.place})</span>
+                            <span>₹${item.price}</span>
+                        </div>
+                    `).join('')}
+                </div>
+                <div class="success-actions">
+                    <button onclick="trackOrder()" class="track-btn">Track Order</button>
+                    <button onclick="goToHome()" class="home-btn">Continue Shopping</button>
+                </div>
+            </div>
+        </div>
+    `;
+    successModal.setAttribute("class", "order-success-overlay");
+    document.body.appendChild(successModal);
+    
+    // Clear cart after successful order
+    localStorage.removeItem("cartProducts");
+    localStorage.removeItem("couponApplied");
+}
+
+function trackOrder() {
+    let currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
+    alert(`Your order ${currentOrder.orderId} is being prepared. Estimated delivery: ${new Date(currentOrder.estimatedDelivery).toLocaleTimeString()}`);
+    goToHome();
+}
+
+function goToHome() {
+    document.querySelector(".order-success-overlay").remove();
+    location.href = "../index.html";
+}
+
+// Make functions globally available
+window.trackOrder = trackOrder;
+window.goToHome = goToHome;</parameter>