import React from "react";
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../util/format";

import { Container, ProductTable, Total } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map((product: Product) => ({
    id: product.id,
    title: product.title,
    priceFormatted: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(product.price),
    price: product.price,
    image: product.image,
    amount: product.amount,
    total: formatPrice(product.price * product.amount),
  }));
  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      const productTotal = product.price * product.amount;
      return sumTotal + productTotal;
    }, 0),
  );

  function handleProductIncrement(product: Product) {
    const newAmount = product.amount + 1;
    const updateAmount = {
      productId: product.id,
      amount: newAmount,
    } as UpdateProductAmount;

    updateProductAmount(updateAmount);
  }

  function handleProductDecrement(product: Product) {
    const newAmount = product.amount - 1;
    const updateAmount = {
      productId: product.id,
      amount: newAmount,
    } as UpdateProductAmount;

    updateProductAmount(updateAmount);
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted &&
            cartFormatted.map((product) => (
              <tr key={product.id} data-testid="product">
                <td>
                  <img src={product.image} alt={product.title} />
                </td>
                <td>
                  <strong>{product.title}</strong>
                  <span>{product.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={product.amount <= 1}
                      onClick={() => handleProductDecrement(product)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={product.amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(product)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{product.total}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
