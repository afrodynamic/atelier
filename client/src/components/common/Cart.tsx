import { FC, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetUserCart } from '../../features/productDetail/productDetailSlice';

export const Cart: FC = () => {
  const dispatch = useAppDispatch();

  const userCart = useAppSelector((state) => state.productDetail.userCart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (!userCart) {
      return;
    }

    let count = 0;
    let sum = 0;

    Object.values(userCart).forEach((cartItems) => {
      const productQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
      count += productQuantity;

      const productSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      sum += productSubtotal;
    });

    setTotalItems(count);
    setSubtotal(sum);
  }, [userCart]);

  const handleViewCart = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitCheckout = () => {
    setIsModalOpen(false);
    dispatch(resetUserCart());
  };

  return (
    <>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle hover:text-primary">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="badge badge-sm indicator-item">{totalItems}</span>
          </div>
        </label>

        <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
          <div className="card-body">
            <span className="font-bold text-lg">{totalItems} Items</span>
            <span className="text-info">Subtotal: ${subtotal}</span>
            <div className="card-actions">
              <button className="btn btn-primary btn-block" onClick={handleViewCart}>
            View cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto">
          <div className="modal modal-open w-full">
            <div className="modal-box min-w-[1024px]">
              <div className="modal-header">
                <h3 className="modal-title text-3xl text-center">Cart</h3>
                <button
                  className="btn btn-error btn-circle btn-xs modal-close absolute top-2 right-2 hover:"
                  onClick={closeModal}
                >
                  x
                </button>
              </div>
              <div className="modal-body">
                <table className="table table-auto w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Product</th>
                      <th>Style</th>
                      <th>Size</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(userCart).flatMap((cartItems) => (
                      cartItems.map((item) => (
                        <tr key={item.skuId}>
                          <td>
                            <img src={item.image} alt={item.productName} className="w-12 h-12" />
                          </td>
                          <td>{item.productName}</td>
                          <td>{item.styleName}</td>
                          <td>{item.size}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price}</td>
                          <td>${item.price * item.quantity}</td>
                        </tr>
                      ))

                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <div className="flex flex-col w-1/3 bg-neutral p-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${(subtotal * 0.1).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>${(subtotal * 1.1).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mx-auto">
                      <button className="btn btn-success" onClick={handleSubmitCheckout}>Checkout</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop backdrop-opacity-50"></div>
        </div>
      )}
    </>
  );
};
