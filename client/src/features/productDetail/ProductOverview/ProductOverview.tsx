import { FC, useEffect, useState } from 'react';
import { useAddToCartMutation, useGetProductDetailsQuery, useGetProductStylesQuery } from '../../../api/api';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ImageCarouselWithThumbnails } from '../../../components/common/ImageCarouselWithThumbnails';
import { addCartItem, setSelectedQuantity, setSelectedSize, setSelectedStyleId, setSelectedStyleImage, setSelectedStyleSKU } from '../productDetailSlice';
import { CartItem, Style } from '../types';

export const ProductOverview: FC = () => {
  const dispatch = useAppDispatch();

  const productId = useAppSelector((state) => state.productDetail.selectedProductId);
  const selectedStyleId = useAppSelector((state) => state.productDetail.selectedStyleId);
  const selectedStyleSKU = useAppSelector((state) => state.productDetail.selectedStyleSKU);
  const selectedSize = useAppSelector((state) => state.productDetail.selectedSize);
  const selectedQuantity = useAppSelector((state) => state.productDetail.selectedQuantity);

  const { data: product, isLoading: isProductLoading } = useGetProductDetailsQuery(productId);
  const { data: styles, isLoading: isStylesLoading, isSuccess: isStylesSuccess } = useGetProductStylesQuery(productId, {
    skip: !productId
  });

  const [addToCart, { isLoading: isAddToCartLoading }] = useAddToCartMutation();

  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [maxQuantity, setMaxQuantity] = useState(15);

  useEffect(() => {
    if (isStylesSuccess && styles?.length > 0) {

      const styleId = styles.find((style) => style['default?'])?.style_id || styles[0].style_id;
      const style = styles.find((style) => style.style_id === styleId);

      if (styleId && style) {
        setSelectedStyle(style);
        dispatch(setSelectedStyleId(styleId));
        dispatch(setSelectedStyleSKU(style?.skus && Number(Object.keys(style.skus)[0]) || 0));
        dispatch(setSelectedStyleImage(style?.photos[0].url || ''));
        dispatch(setSelectedSize(style?.skus && Object.values(style.skus)[0].size || '-'));
        dispatch(setSelectedQuantity(1));
      }
    }
  }, [isStylesSuccess, styles]);

  const handleStyleChange = (styleId: number) => {
    if (!styles) {
      return;
    }

    const newStyle = styles.find((style) => style.style_id === styleId);
    if (newStyle?.style_id) {
      dispatch(setSelectedStyleId(newStyle?.style_id));
      setSelectedStyle(newStyle || null);
    }
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedStyle) {
      return;
    }

    dispatch(setSelectedSize(event.target.value));

    if (selectedStyle) {
      const sku = Object.values(selectedStyle.skus).find((sku) => sku.size === event.target.value);

      if (sku) {
        const max = Math.min(sku.quantity, 15);
        setMaxQuantity(max);
        setSelectedQuantity(1);
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedStyle || !selectedSize || !selectedQuantity) {
      return;
    }

    const cartItem: CartItem = {
      skuId: selectedStyleSKU,
      quantity: selectedQuantity,
      size: selectedSize,
      productName: product?.name || '',
      styleName: selectedStyle.name,
      price: Number(selectedStyle.sale_price || selectedStyle.original_price),
      image: selectedStyle.photos[0].url,
    };

    dispatch(addCartItem(cartItem));
  };

  return (
    <div data-testid="product-overview" className="dark:bg-gray-800 my-4 p-4">
      <div className="text-center">
        <h2 className="text-4xl py-4">Product Overview</h2>
      </div>

      {(isStylesLoading || isProductLoading) && <div>Loading...</div>}

      {isStylesSuccess && selectedStyle && (
        <div className="flex flex-wrap bg-neutral p-4">
          <div className="w-full">
            <div className="flex">
              {/* Image Carousel */}
              <div className="w-1/2">
                <ImageCarouselWithThumbnails images={selectedStyle?.photos || []} />
              </div>

              {/* Product Details */}
              <div className="w-1/2 pl-4">
                <div className="mb-4">
                  {/* Product Information */}
                  <span className="badge badge-ghost mb-2">{product?.category}</span>
                  <h2 className="text-3xl my-4 text-center">{product?.name}</h2>
                  {/* Sale Price */}
                  {selectedStyle.sale_price ? (
                    <div>
                      <span className="text-red-500 line-through">${selectedStyle.original_price}</span>
                      {' '}
                      <span className="text-red-500">${selectedStyle.sale_price}</span>
                    </div>
                  ) : (
                    <div>${selectedStyle.original_price}</div>
                  )}
                </div>

                {/* Style Selector */}
                <div className="mb-4">
                  <div className="flex flex-wrap">
                    {styles.map((style) => (
                      <div key={style.style_id} className="w-1/4 p-2">
                        <button
                          className={`rounded-lg shadow-lg w-full h-full p-2 ${
                            style.style_id === selectedStyleId ? 'bg-blue-500 text-white' : 'bg-white text-black'
                          }`}
                          onClick={() => handleStyleChange(style.style_id)}
                        >
                          {style.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add to Cart */}
                <div>
                  {selectedStyle && Object.values(selectedStyle.skus).some((sku) => sku.quantity > 0) ? (
                    <div className="form-control">
                      <div className="flex flex-row space-x-2 h-full items-end">
                        {/* Quantity Selector */}
                        <div className="">
                          <label htmlFor="quantity" className="label">
                            <span className="label-text">Quantity</span>
                          </label>
                          <select
                            id="quantity"
                            className="h-full select select-bordered px-2 py-2 w-24 text-center"
                            onChange={(e) => dispatch(setSelectedQuantity(Number(e.target.value)))}
                            disabled={isAddToCartLoading}
                            defaultValue={'-'}
                          >
                            <option value="-" disabled>-</option>
                            {[...Array(10)].map((_, i) => (
                              <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                        </div>

                        {/* Size Selector */}
                        <div className="">
                          <label htmlFor="size" className="label">
                            <span className="label-text">Size</span>
                          </label>
                          <select
                            id="size"
                            className="h-full select select-bordered px-2 py-2 w-24 text-center"
                            value={selectedSize}
                            onChange={(event) => handleSizeChange(event)}
                            disabled={!selectedSize || isAddToCartLoading}
                          >
                            {selectedStyle &&
                                Array.from(new Set(Object.values(selectedStyle.skus).map((sku) => sku.size))).map((size) => (
                                  <option key={`${selectedStyleId}-${size}`} value={String(size)}>{size}</option>
                                ))
                            }
                          </select>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="">
                          <button
                            className="rounded-lg h-12 bg-blue-500 text-white p-2"
                            onClick={handleAddToCart}
                            disabled={!selectedSize || !selectedQuantity || isAddToCartLoading || !selectedStyle || !Object.values(selectedStyle.skus).some((sku) => sku.quantity > 0)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-center text-xl text-error font-bold">Out of Stock</h3>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full m-4">
            {/* Slogan and Description */}
            <div className="w-4/5 pr-4">
              {product?.slogan && <p className="italic font-bold first-letter">{product.slogan}</p>}
              {product?.description && <p>{product.description}</p>}
            </div>
            <div className="w-1/5 pl-4 border-l border-gray-300">
              {product?.features && product.features.length > 0 && (
                <ul>
                  <h4>Features</h4>
                  {product.features.map((feature) => (
                    <li className="ml-2" key={feature.feature}> {feature.feature}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
