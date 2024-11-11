# E-Commerce Platform

## Overview

This is a robust **E-Commerce Platform** built with **Node.js**, **EJS**, **HTML**, and **CSS**. The platform includes separate sections for users, sellers, and admins. Sellers can manage their product listings by adding or removing items, while users can browse products, add them to their cart, and complete purchases. Admins have full control over the platform, including managing users and sellers, monitoring orders, and moderating content. The platform also integrates **Razorpay**'s API for secure payment processing in a test environment.

## Features

### For Users:
- **Browse Products:** Users can view a wide range of products, search and filter based on categories.
- **Add to Cart:** Users can add products to their cart and proceed to checkout.
- **Make Purchases:** Integrated **Razorpay** payment gateway allows users to securely complete their orders.

### For Sellers:
- **Manage Product Listings:** Sellers can add new products or remove existing products from the platform.
- **Update Product Details:** Sellers can update product information such as price, description, and stock availability.

### For Admins:
- **Order Monitoring:** Admins can view and track orders placed by users.
- **Content Moderation:** Admins can approve, delete, or flag inappropriate content.

### Additional Features:
- **Razorpay Integration:** Secure payment gateway integration for handling payments via Razorpay API (using test environment).
- **Authentication & Authorization:** Role-based access (user, seller, admin) with secure login and registration processes.
- **Responsive Design:** The platform adapts to various screen sizes, making it accessible on both mobile and desktop devices.

## Technologies Used

- **Frontend:**  
  - HTML  
  - CSS  
  - EJS (Embedded JavaScript Templates)

- **Backend:**  
  - Node.js  
  - Express.js

- **Database:**  
  - MongoDB (for storing user, product, and order data)

- **Payment Gateway:**  
  - Razorpay API (test environment for secure transactions)

## Installation & Setup

To set up this project locally, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/Hirdhyakk/E-Commerce.git
cd E-Commerce
```

### Install Dependencies

Navigate to the project directory and install all the required dependencies using npm:

```bash
npm install
```

### Set Up Environment Variables

Create a .env file in the root of the project directory and add the following environment variables:

```bash
MONGO_URI=<your-mongodb-connection-string>
GMAIL_USER=
GMAIL_PASS=
JWT_SECRET=
```

- Replace <your-mongodb-connection-string> with your MongoDB URI.
- Replace <your-razorpay-key-id> and <your-razorpay-key-secret> with your Razorpay credentials (you can get them from Razorpay's dashboard).
- Set a random string for the SESSION_SECRET to manage session data securely.

## Run the Application

Once everything is set up, you can start the application by running:

```bash
npm start
```

This will launch the application in your browser.

## Contributing

If you’d like to contribute to this project, feel free to fork the repository, make your changes, and submit a pull request. Contributions, suggestions, and improvements are always welcome!
