@@ .. @@
 const appendData =(data,location)=>{

     location.innerHTML ="";
     data.map((ele)=>{
         // let rating = (ele.rating/1).toFixed(2);
         let mainDiv = document.createElement("div");
         let img = document.createElement("img");
         let headDiv1 = document.createElement("div");
         let subHeadDEle1= document.createElement("h4");
         let subHeadDEle2= document.createElement("h5");
         let subHeadDEle3= document.createElement("p");
         let subHeadDEle4= document.createElement("p");
         let headDiv2 = document.createElement("div");
         let subHeadDEle5 =document.createElement("p");
         let subHeadDEle6 =document.createElement("p");
         let addToCartDiv = document.createElement("div");
+        let foodItemsDiv = document.createElement("div");
         let time = document.createElement("p");
         addToCartDiv.innerHTML=`<i class="fa-solid fa-cart-shopping"></i> Add To Cart`;
         addToCartDiv.setAttribute("class","addToCart");
-        addToCartDiv.addEventListener("click",addToCart);
+        
+        // Create food items for each restaurant
+        let foodItems = generateFoodItems(ele);
+        foodItemsDiv.innerHTML = `
+            <div class="food-items-section">
+                <h5>Popular Items:</h5>
+                <div class="food-items-grid">
+                    ${foodItems.map(item => `
+                        <div class="food-item-card">
+                            <img src="${item.image}" alt="${item.name}" class="food-item-image">
+                            <div class="food-item-info">
+                                <h6>${item.name}</h6>
+                                <p class="food-item-price">₹${item.price}</p>
+                                <button class="add-food-item-btn" onclick="addFoodItemToCart('${item.id}', '${item.name}', ${item.price}, '${item.image}', '${ele.name}')">
+                                    Add to Cart
+                                </button>
+                            </div>
+                        </div>
+                    `).join('')}
+                </div>
+            </div>
+        `;
+        foodItemsDiv.setAttribute("class", "food-items-container");
+        
         img.src=ele.img;
         img.setAttribute("class","width100")
         time.innerText=ele.distance;
@@ .. @@
         headDiv2.append(subHeadDEle5,subHeadDEle6);
         headDiv2.setAttribute("class","containerHeadDiv2");


-        mainDiv.append(img,time,headDiv1,headDiv2);
+        mainDiv.append(img,time,headDiv1,headDiv2,foodItemsDiv);
         location.append(mainDiv);


         



     })




 }

+// Generate food items for each restaurant (same as food.js)
+const generateFoodItems = (restaurant) => {
+    const foodCategories = {
+        'Pizza': [
+            { name: 'Margherita Pizza', image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300' },
+            { name: 'Pepperoni Pizza', image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=300' }
+        ],
+        'Burger': [
+            { name: 'Classic Burger', image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300' },
+            { name: 'Cheese Burger', image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=300' }
+        ],
+        'Chinese': [
+            { name: 'Fried Rice', image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=300' },
+            { name: 'Noodles', image: 'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=300' }
+        ],
+        'Indian': [
+            { name: 'Butter Chicken', image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300' },
+            { name: 'Biryani', image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=300' }
+        ],
+        'default': [
+            { name: 'Special Dish', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300' },
+            { name: 'Chef Special', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300' }
+        ]
+    };

+    // Determine food category based on restaurant tags or name
+    let category = 'default';
+    if (restaurant.tags && restaurant.tags.toLowerCase().includes('pizza')) category = 'Pizza';
+    else if (restaurant.tags && restaurant.tags.toLowerCase().includes('burger')) category = 'Burger';
+    else if (restaurant.tags && restaurant.tags.toLowerCase().includes('chinese')) category = 'Chinese';
+    else if (restaurant.tags && restaurant.tags.toLowerCase().includes('indian')) category = 'Indian';

+    const items = foodCategories[category];
+    return items.map((item, index) => ({
+        id: `${restaurant.id || Date.now()}_${index}`,
+        name: item.name,
+        price: Math.floor(Math.random() * 300) + 100,
+        image: item.image,
+        restaurantId: restaurant.id,
+        restaurantName: restaurant.name
+    }));
+};

+// Add food item to cart function
+window.addFoodItemToCart = (itemId, itemName, itemPrice, itemImage, restaurantName) => {
+    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
+    
+    let existingItem = cartProducts.find(item => item.id === itemId);
+    
+    if (existingItem) {
+        existingItem.qty = (existingItem.qty || 1) + 1;
+        existingItem.price = (itemPrice * existingItem.qty);
+    } else {
+        let newItem = {
+            id: itemId,
+            food: itemName,
+            place: restaurantName,
+            price: itemPrice,
+            img: itemImage,
+            qty: 1
+        };
+        cartProducts.push(newItem);
+    }
+    
+    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
+    
+    let alert = document.getElementById("alert");
+    alert.style.color = "white";
+    alert.style.backgroundColor = "green";
+    alert.style.border = "1px solid green";
+    alert.innerHTML = `${itemName} Added To Cart <i class="fa-sharp fa-solid fa-circle-check"></i>`;
+    alert.style.display = "block";
+    
+    setTimeout(() => {
+        alert.style.display = "none";
+    }, 1500);
+    
+    if (document.getElementById("badgeNumber")) {
+        document.getElementById("badgeNumber").innerText = cartProducts.length;
+    }
+};


 const fetchDataSupport =async(url)=>{</parameter>