# Airbean - Individuellt projekt
Created by: Marina Rosenstiel

Follow these steps to run the project:

**1. Clone git-repo**

- Open your terminal/console and run this command git clone <repo-url>

**2. Navigate to project:**

- Run the command: cd <project folder>

**3. Install dependencies:**

- Run the npm install command to install all necessary dependencies needed.

**4. Start server:**

- Use nodemon . command to run the server || npm run dev.

**5. Start your api application and use the urls below to test the project**

##  Endpoints & description

### Base url:

http://localhost:8000/api/

### Menu:

http://localhost:8000/api/company/menu  
Method: GET

Use this url to get menu 

### Company info:

http://localhost:8000/api/company/companyInfo  
Method: GET  

Use this url to get info about the company 

### Create user:

http://localhost:8000/api/users/signup  
Method: POST

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for creating users:

```json
{
  "username": "user",
  "password": "test123"
}
```

Will give the user this response:

```json
{
  "message": "User created.",
  "user": {
    "id": "randomlyGeneratedNumbersAndLetters987",
    "username": "user"
  }
}
```

\*You will need the ID to create orders as a user and to retrieve your order history.

### Login user:

http://localhost:8000/api/users/login  
Method: POST

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for logging in users:

```json
{
  "username": "user",
  "password": "test123"
}
```

Will give the user this response:

```json
{
  "message": "Login successful. Logged in user: user. Id: “randomlyGeneratedNumbersAndLetters987"
}
```

\*You will need the ID to create orders as a user and to retrieve your order history.

### Create order:

http://localhost:8000/api/order/createOrder  
Method: POST

Add query params Key: userId and the Value: {userId} when creating the order as a registered user.

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for creating several orders:

```json
[
  {
    "id": 1,
    "title": "Bryggkaffe",
    "desc": "Bryggd på månadens bönor.",
    "price": 39
  },
  {
    "id": 2,
    "title": "Caffè Doppio",
    "desc": "Bryggd på månadens bönor.",
    "price": 49
  }
]
```

Will give the user the response: "Your order id: 000."

### Send order:  

http://localhost:8000/api/order/sendOrder/:orderId  
Method: POST  

To complete your order use sendOrder with your order id as a param. Order will be sent to completedOrder.db. You can then see order history and order status.

### Get cart:  

http://localhost:8000/api/order/getCart/:orderId  
Method: GET  

When you create an order in CreateOrder you’ll receive an orderId. Copy that orderId and paste it at the end of the URL as a param. For example, if you receive a response of orderId 349 then paste it like this. http://localhost:8000/api/order/getCart/349

### Add item cart:

http://localhost:8000/api/order/addItemCart/:orderId  
Method: PUT

If you want to add something in your cart then you can use this method.
Almost like you did in getCart you’ll have to paste your orderId at the end of the URL as a param.
In the body tab in insomnia/postman. Take note that it’s very important that you choose something from the menu.js file otherwise you’ll receive: error: "Items must match menu". Go to: Vs Code >> services >> menu.js to see the menu list or make a get request: http://localhost:8000/api/company/menu

### Delete item:

http://localhost:8000/api/order/deleteItem/:orderId?itemId=<ProductId>  
Method: DELETE

Go to the "Parameters" tab (in Postman or Insomnia).
Add query params key: itemId and the value: {itemId} when deleting an item from the order.

###  Order confirmation:  
http://localhost:8000/api/order/orderConfirmation/:orderId  
Method: GET  
\*Must be done after calling sendOrder.

### Order history for registered users:

http://localhost:8000/api/order/orderHistory/:userId  
Method: GET

Will give the user this response:

```json
{
  "orderHistory": [
    {
      "orderId": "000",
      "estDelivery": "11:28",
      "newOrder": [
        {
          "id": 1,
          "title": "Bryggkaffe",
          "desc": "Bryggd på månadens bönor.",
          "price": 39
        }
      ],
      "userId": "randomlyGeneratedNumbersAndLetters987",
      "_id": "randomlyGeneratedNumber"
    }
  ]
}
```

### Logout user:

http://localhost:8000/api/users/logout  
Method: POST  

Use this url to logout user

##  Endpoints & description regarding admin

### Get menu:

http://localhost:8000/api/admin/menu    
Method: GET  

Use this url to get menu 

### Log in 
http://localhost:8000/api/admin/login  
Method: POST  

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Use below to log in admin:

```json
{
  "username": "admin",
  "password": "password"
}
```

Will give the user this response:

```json
{
  "message": "Login successful. Logged in user: admin"
}
```

### Add product  
http://localhost:8000/api/admin/addProduct  
Method: POST

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for adding a product:

```json
  {
    "id": 7,
    "title": "Kaffe latte",
    "desc": "Bryggd på månadens bönor.",
    "price": 55
  }
```

A response will be sent with createdAt

```json
{
	"_id": 7,
	"title": "Kaffe latte",
	"desc": "Bryggd på månadens bönor.",
	"price": 55,
	"createdAt": "2024-06-10 13:50:13"
}
```


###  Change product  
http://localhost:8000/api/admin/changeProduct/:itemId  
Method: PUT  

Add the productId of the product you want to change as a param  

Go to the "Body" tab (in Postman or Insomnia).  
Select "JSON" as the format.  
Paste your JSON structure into the json field with the propertie or properties you want to change, for example  

```json
{
"price": 75
}
```

A response will be sent including changes and modifiedAt
```json
{
	"success": true,
	"message": "Item updated in menu",
	"item": {
		"_id": 7,
		"title": "Kaffe latte",
		"desc": "Bryggd på månadens bönor.",
		"price": 75,
		"createdAt": "2024-06-10 13:50:13",
		"modifiedAt": "2024-06-10 13:50:27"
	}
}
```

### Delete product  
http://localhost:8000/api/admin/deleteProduct/:itemId  
Method: DELETE  

Add the productId of the product you want to delete as a param  

If the request succeeds you will receive  

```json
{
	"message": "Product has been removed."
}
```

### Create campaign  
http://localhost:8000/api/admin/campaign  
Method: POST  

The campaign works as follows: the price of the products that admin sends in their request are totaled, and a 10% discount is applied to the price. Admin submits the desired products as shown below

```json
{
"products": [1, 4, 6]
}
```

Th response will contain the new price, campaignPrice, with 10% discount and will be saved in campaigns database: 
```json
{
	"success": true,
	"message": "Campaign created successfully",
	"campaign": {
		"products": [
			1,
			4,
			7
		],
		"campaignPrice": "146.70",
		"createdAt": "2024-06-10 13:50:39",
		"_id": "fih3IO6oQdZqju7L"
	}
}
```
