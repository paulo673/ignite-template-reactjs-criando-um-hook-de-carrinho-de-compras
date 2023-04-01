import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce<CartItemsAmount>((sumAmount, product) => {
    if (sumAmount[product.id]) {
      sumAmount[product.id] += product.amount;
    } else {
      sumAmount[product.id] = product.amount;
    }
    return sumAmount;
  }, {});

  useEffect(() => {
    async function loadProducts() {
      const storeProducts = await api
        .get("/products")
        .then((response) => response.data);

      const formattedProducts = storeProducts.map((product: Product) => {
        return {
          id: product.id,
          title: product.title,
          priceFormatted: formatPrice(product.price),
          image: product.image,
        };
      });

      setProducts(formattedProducts);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products &&
        products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(product.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[product.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
    </ProductList>
  );
};

export default Home;
