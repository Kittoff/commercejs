import React, { FC, useEffect, useState } from "react";
import { commerce } from "./lib/commerce";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Navbar, Products, Cart } from "./components";

import { ProductType } from "./components/Products/Products";
import Checkout from "./components/CheckoutForm/Checkout/Checkout";

interface Props {}

// type CartType = {
//   cart: Object
// }

const App: FC<any> = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [cart, setCart] = useState<any>({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  const handleAddToCart = async (productId: string, quantity: number) => {
    const response = await commerce.cart.add(productId, quantity);

    setCart(response.cart);
  };

  const handleUpdateCartQuantity = async (
    productId: string,
    quantity: number
  ) => {
    const response = await commerce.cart.update(productId, { quantity });
    setCart(response.cart);
  };
  const handleRemoveFromCart = async (productId: string) => {
    const response = await commerce.cart.remove(productId);
    setCart(response.cart);
  };
  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();
    setCart(response.cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId: any, newOrder: any) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );
      setOrder(incomingOrder);
      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const cartProps = {
    cart: cart,
    handleUpdateCartQuantity: handleUpdateCartQuantity,
    handleRemoveFromCart: handleRemoveFromCart,
    handleEmptyCart: handleEmptyCart,
  };

  const checkoutProps = {
    cart: cart,
  };

  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={handleAddToCart} />
          </Route>
          <Route exact path="/cart">
            <Cart {...cartProps} />
          </Route>
          <Route exact path="/checkout">
            <Checkout
              {...checkoutProps}
              order={order}
              onCaptureCheckout={handleCaptureCheckout}
              error={errorMessage}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
