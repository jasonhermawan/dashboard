    let data = [];
    let cart = [];
    let transactionHistory = [];
    let lastSku = 0;
    let isEditing = false;
    let editingIndex = -1;

    function addData() {
      let image = document.getElementById("product-img").value;
      let name = document.getElementById("product-name").value;
      let category = document.getElementById("product-category").value;
      let price = Number(document.getElementById("product-price").value);
      let stock = document.getElementById("product-stock").value;

      data.push({sku: lastSku + 1, image, name, category, price, stock});
      lastSku++;
      printData();
      clearForm();
    }

    function printData() {
      let tableBody = document.getElementById("product-tables");
      tableBody.innerHTML = "";

      data.forEach((value, index) => {
        // let sku = index+1;
        const content = `
          <tr class="single-product">
            <td>SKU - ${isEditing && editingIndex === index ? `<input type="text" id="editSku" value="${value.sku}" style="width: 30%">` : value.sku}</td>
            <td>
              ${isEditing && editingIndex === index ? `<input type="url" id="editImg" placeholder="Enter image URL" value="${value.image}">` : `<img src="${value.image}" height="50px"></img>`}
            </td>
            <td class="product-name">${isEditing && editingIndex === index ? `<input type="text" id="editName" value="${value.name}">` : value.name}</td>
            <td class="product-category">
              ${isEditing && editingIndex === index ? `
              <select name="" id="editCategory">
                <option value="${value.category}">Choose Category</option>
                <option value="Food">Food</option>
                <option value="Drink">Drink</option>
                <option value="Snack">Snack</option>
              </select>
              ` : value.category}
            </td>
            <td>${isEditing && editingIndex === index ? `<input type="number" id="editStock" value="${value.stock}">` : value.stock}</td>
            <td class="product-price">${isEditing && editingIndex === index ? `<input type="number" id="editPrice" value="${value.price}">` : value.price}</td>
            <td>
              ${isEditing && editingIndex === index ? `<button onclick="saveData(${index})" class="btn-primary">Save</button>` : `<button onclick="editData(${index})" class="btn-primary">Edit</button>`}
              <button onclick="deleteData(${index})" class="btn-primary">Delete</button>
            </td>
            <td><button class="btn-primary" onclick="addCart(${index})">Add to cart</button></td>
          </tr>
        `;
        tableBody.innerHTML += content;
      })
    }

    function editData(index) {
      if (isEditing) {
        alert("Finish editing the current row before editing another one.");
        return;
      }
            
      isEditing = true;
      editingIndex = index;
      printData();
    }

    function saveData(index) {
      const updatedSku = document.getElementById("editSku").value;
      const updatedImg = document.getElementById("editImg").value;
      const updatedName = document.getElementById("editName").value;
      const updatedCategory = document.getElementById("editCategory").value;
      const updatedStock = document.getElementById("editStock").value;
      const updatedPrice = document.getElementById("editPrice").value;

      data[index] = { sku: updatedSku, image: updatedImg, name: updatedName, category: updatedCategory, price: updatedPrice, stock: updatedStock };
      isEditing = false;
      editingIndex = -1;
      printData();
    }

    function deleteData(index) {
      if (isEditing && editingIndex === index) {
        isEditing = false;
        editingIndex = -1;
      }
            
      data.splice(index, 1);
      printData();
    }

    function clearForm() {
      document.getElementById("product-img").value = "";
      document.getElementById("product-name").value = "";
      document.getElementById("product-category").value = "";
      document.getElementById("product-price").value = "";
      document.getElementById("product-stock").value = "";
    }

    // Search Function

    function searchBar() {
      let searchValue = document.getElementById("search-input").value.toLowerCase();
      let items = document.getElementsByClassName("product-name");

      for (let i = 0; i < items.length; i++) {
        items[i].parentNode.style.display = "table-row";
        if (!(items[i].innerHTML.toLowerCase().includes(searchValue))) {
          items[i].parentNode.style.display = "none";
        }
      }
    }

    // Category Btn Function

    function filterCategory() {
      let selectValue = document.getElementById("filter-category").value;
      let categoryItems = document.getElementsByClassName("product-category");
    
      for (let i = 0; i < categoryItems.length; i++) {
        if (selectValue === "") {
          categoryItems[i].parentNode.style.display = "table-row";
        } else {
          if (!(categoryItems[i].innerHTML.toLowerCase().includes(selectValue.toLowerCase()))) {
            categoryItems[i].parentNode.style.display = "none";
          } else {
            categoryItems[i].parentNode.style.display = "table-row";
          }
        }
      }

    }

    // Filter Price

    function priceFilter() {
      let rangePrice = document.getElementById("range-price");
      let items = document.getElementsByClassName("product-price");
      let realTime = document.getElementById("real-time-price");
      realTime.innerHTML = rangePrice.value;

      for (let i = 0; i < items.length; i++) {
        items[i].parentNode.style.display = "table-row"
        if (!(Number(items[i].innerHTML) <= Number(rangePrice.value))) {
          items[i].parentNode.style.display = "none"
        }
      }
    }

    // Cart function

    function addCart(index) {
      const product = data[index];

      if (product) {
        const existInCart = cart.find(item => item.name === product.name);

        if (existInCart) {
          existInCart.quantity++;
        } else {
          product.quantity = 1;
          cart.push(product);
        }
        displayCart();
      }
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      displayCart();
    }

    function displayCart() {
      const cartTable = document.getElementById("cart-tables");
      cartTable.innerHTML = "";

      let cartQuantity = 0;
      let cartTotal = 0;

      cart.forEach((value, index) => {
        const total = value.price * value.quantity;
        cartQuantity += value.quantity;
        cartTotal += total;
        const content = `
          <tr>
            <td>
              SKU - ${value.sku}
            </td>
            <td><img src="${value.image}" height="50px" /></td>
            <td>
              ${value.name}
            </td>
            <td>${value.price}</td>
            <td>${value.quantity}</td>
            <td>
              ${total}
            </td>
            <td><button class="btn-primary" onclick="removeFromCart(${index})">Remove</button></td>
          </tr>
        `;
        cartTable.innerHTML += content
      });
      document.getElementById('cart-quantity').textContent = cartQuantity;
      document.getElementById('cart-total').textContent = `${cartTotal}`;
      document.getElementById('checkout-total').textContent = `${Number(cartTotal)}`;
    }

    function checkout() {
      const checkoutTotal = document.getElementById("checkout-total").textContent;
      const amountPaid = Number(document.getElementById("amount").value);
      const customerName = document.getElementById("customer-name").value;
      const transactionDate = new Date().toLocaleDateString();

        const change = amountPaid - Number(checkoutTotal)

        if (change >= 0) {
          transactionHistory.push({
            transactionDate: transactionDate,
            customerName: customerName,
            total: Number(checkoutTotal),
          })

          alert(`Payment success. Change ${change}`)
          cart.length = 0;
          document.getElementById("customer-name").value = "";
          document.getElementById("amount").value = "";
          displayCart();
          displayTransactionHistory();
          document.getElementById("amount").value = "";
        } else {
          alert(`Insufficient payment. Please enter a valid amount.`)
        }

    }

    function displayTransactionHistory() {
      const historyContent = document.getElementById("history-tables");
      historyContent.innerHTML = "";

      transactionHistory.forEach((value, index) => {
        const content = `
          <tr>
            <td>
              ${index + 1}
            </td>
            <td>${value.transactionDate}</td>
            <td>
              ${value.customerName}
            </td>
            <td>${value.total}</td>
          </tr>
        `;
        historyContent.innerHTML += content;
      })
      dataAnalytics();

    }

    function dataAnalytics() {
      const dataRevenue = document.getElementById("revenue");
      const dataCustomer = document.getElementById("total-customer")
      dataRevenue.textContent = "";
      dataCustomer.textContent = "";
      let totalRevenue = 0;
      for (let i = 0; i < transactionHistory.length; i++) {
        totalRevenue += transactionHistory[i].total;
      }
      dataRevenue.textContent = `${totalRevenue.toLocaleString("id", {style: "currency", currency: "idr"})}`;
      dataCustomer.textContent = transactionHistory.length;
    }