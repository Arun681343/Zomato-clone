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
+        // Create food items for nightlife venues
+        let foodItems = generateNightlifeFoodItems(ele);
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

+// Generate food items for nightlife venues
+const generateNightlifeFoodItems = (restaurant) => {
+    const nightlifeFoodCategories = {
+        'Bar': [
+            { name: 'Cocktail Special', image: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=300' },
+            { name: 'Beer Platter', image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=300' }
+        ],
+        'Pub': [
+            { name: 'Wings & Beer', image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=300' },
+            { name: 'Nachos Platter', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300' }
+        ],
+        'default': [
+            { name: 'House Special', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300' },
+            { name: 'Party Snacks', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300' }
+        ]
+    };

+    let category = 'default';
+    if (restaurant.tags && restaurant.tags.toLowerCase().includes('bar')) category = 'Bar';
+    else if (restaurant.tags && restaurant.tags.toLowerCase().includes('pub')) category = 'Pub';

+    const items = nightlifeFoodCategories[category];
+    return items.map((item, index) => ({
+        id: `${restaurant.id || Date.now()}_${index}`,
+        name: item.name,
+        price: Math.floor(Math.random() * 500) + 200, // Higher prices for nightlife
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