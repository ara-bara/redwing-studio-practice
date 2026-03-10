import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatMoney } from "../../utils/formatMoney";
import { calcPricing } from "../../utils/pricing";
import { getProducts, getProductsById } from "../../utils/productApi";
import styles from "./Product.module.scss";
import ProductSkeleton from "./ProductSkeleton";
export default function Product() {
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingAllProducts, setLoadingAllProducts] = useState(false);
  const [product, setProduct] = useState(null);
  const [errorProduct, setErrorProduct] = useState("");
  const [errorAllProduct, setErrorAllProduct] = useState("");
  const [recentProducts, setRecentProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    async function load() {
      setLoadingProduct(true);
      setErrorProduct("");
      setProduct(null);

      try {
        const item = await getProductsById(id);
        setProduct(item);
      } catch (e) {
        setErrorProduct("No received data");
      } finally {
        setLoadingProduct(false);
      }
    }

    load();
  }, [id]);

  useEffect(() => {
    async function loadProducts() {
      setLoadingAllProducts(true);
      setErrorAllProduct("");
      try {
        const products = await getProducts(194);
        setAllProducts(products);
      } catch (e) {
        setErrorAllProduct("No data received");
      } finally {
        setLoadingAllProducts(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    let recentViews = JSON.parse(localStorage.getItem("recent")) || [];
    setRecentProducts(recentViews);
  }, []);
  useEffect(() => {
    if (!product) return;

    let recentViews = JSON.parse(localStorage.getItem("recent")) || [];

    recentViews = recentViews.filter((item) => item.id !== product.id);
    recentViews = [...recentViews, product];

    let newViews = recentViews.slice(-6, -1);

    localStorage.setItem("recent", JSON.stringify(recentViews));
    setRecentProducts(newViews);
  }, [product]);

  const pricing = useMemo(() => {
    if (!product) return null;
    return calcPricing(product.price, product.discountPercentage);
  }, [product]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    if (!allProducts.length) return [];
    return allProducts
      .filter(
        (item) => item.id !== product.id && item.category === product.category,
      )
      .sort(
        (a, b) =>
          Math.abs(a.price - product.price) - Math.abs(b.price - product.price),
      )
      .slice(0, 4);
  }, [product, allProducts]);

  if (errorProduct) return <div className={styles.center}>{errorProduct}</div>;
  if (loadingProduct || (!product && !errorProduct)) return <ProductSkeleton />;

  const imgSrc = product?.images?.[0] || product?.thumbnail || "";

  const features = [
    product?.availabilityStatus
      ? { k: "Availability", v: product.availabilityStatus }
      : null,
    product?.shippingInformation
      ? { k: "Shipping", v: product.shippingInformation }
      : null,
    product?.returnPolicy ? { k: "Returns", v: product.returnPolicy } : null,
    product?.warrantyInformation
      ? { k: "Warranty", v: product.warrantyInformation }
      : null,
    Number.isFinite(Number(product?.minimumOrderQuantity))
      ? { k: "Min order", v: String(product.minimumOrderQuantity) }
      : null,
    Number.isFinite(Number(product?.weight))
      ? { k: "Weight", v: `${product.weight} g` }
      : null,
    product?.dimensions?.width
      ? {
          k: "Size",
          v: `${product.dimensions.width}×${product.dimensions.height}×${product.dimensions.depth}`,
        }
      : null,
  ].filter(Boolean);

  const tags =
    Array.isArray(product?.tags) && product.tags.length ? product.tags : [];

  const detailsRows = [
    ...features,
    tags.length ? { k: "Tags", v: tags.slice(0, 8).join(", ") } : null,
  ].filter(Boolean);

  const reviews =
    Array.isArray(product?.reviews) && product.reviews.length
      ? product.reviews
      : [];

  const isInCart = items.some((item) => item.id === product.id);

  const cartButton = isInCart ? (
    <Link to="/cart" className={styles.primaryBtn}>
      Go to cart
    </Link>
  ) : (
    <button
      type="button"
      className={styles.primaryBtn}
      onClick={() => addToCart(product)}
    >
      + ADD TO CART
    </button>
  );

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topbar}>
          <Link className={styles.back} to="/">
            ← Back to products
          </Link>

          <div className={styles.topRight}>
            <span className={styles.topLabel}>Category</span>
            <span className={styles.pill}>{product.category}</span>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.mediaCol}>
            <div className={styles.mediaSticky}>
              <div className={styles.media}>
                <img className={styles.img} src={imgSrc} alt={product.title} />
              </div>
            </div>
          </div>

          <div className={styles.infoCol}>
            <h1 className={styles.h1}>{product.title}</h1>

            <div className={styles.metaRow}>
              {product.brand && (
                <>
                  <span className={styles.brand}>{product.brand}</span>
                  <span className={styles.dot}>•</span>
                </>
              )}
              <span className={styles.rating}>
                ★ {Number(product.rating).toFixed(1)}
              </span>
              <span className={styles.dot}>•</span>
              <span className={styles.stock}>{product.stock} in stock</span>
            </div>

            <div className={styles.priceBox}>
              <div className={styles.priceLine}>
                <span className={styles.priceNow}>
                  {formatMoney(pricing.priceNow)}
                </span>

                {pricing.hasDiscount && (
                  <span className={styles.priceOld}>
                    {formatMoney(pricing.oldPrice)}
                  </span>
                )}
              </div>

              {pricing.hasDiscount && (
                <div className={styles.savings}>
                  You save {Math.round(pricing.discount)}%
                </div>
              )}
            </div>

            <div className={styles.desc}>
              <div className={styles.h2}>Description</div>
              <p className={styles.p}>{product.description}</p>
            </div>
            {cartButton}

            <div className={styles.detailsGrid}>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>SKU</span>
                <span className={styles.detailValue}>
                  #{String(product.id).padStart(4, "0")}
                </span>
              </div>

              <div className={styles.detail}>
                <span className={styles.detailLabel}>Availability</span>
                <span className={styles.detailValue}>
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </span>
              </div>

              <div className={styles.detail}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{product.category}</span>
              </div>

              {product.brand && (
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Brand</span>
                  <span className={styles.detailValue}>{product.brand}</span>
                </div>
              )}
            </div>

            {detailsRows.length > 0 && (
              <div className={styles.block}>
                <div className={styles.blockTitle}>Details</div>
                <div className={styles.kv}>
                  {detailsRows.map((row) => (
                    <div key={row.k} className={styles.kvRow}>
                      <span className={styles.kvK}>{row.k}</span>
                      <span className={styles.kvV}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {recentProducts.length > 0 && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Recently viewed</h2>
            </div>

            <div className={styles.recentGrid}>
              {recentProducts.map((item) => {
                const isRecentInCart = items.some(
                  (cartItem) => cartItem.id === item.id,
                );

                return (
                  <div key={item.id} className={styles.recentCard}>
                    <Link
                      to={`/product/${item.id}`}
                      className={styles.cardLink}
                    >
                      <div className={styles.recentMedia}>
                        <img
                          src={item.thumbnail || item.images?.[0]}
                          alt={item.title}
                          className={styles.recentImg}
                        />
                      </div>

                      <div className={styles.recentBody}>
                        <div className={styles.recentCategory}>
                          {item.category}
                        </div>
                        <div className={styles.recentTitle}>{item.title}</div>
                        <div className={styles.recentBottom}>
                          <span className={styles.recentPrice}>
                            {formatMoney(item.price)}
                          </span>
                          <span className={styles.recentRating}>
                            ★ {Number(item.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {isRecentInCart ? (
                      <Link to="/cart" className={styles.cardIconBtn}>
                        ✓
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={styles.cardIconBtn}
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loadingAllProducts && similarProducts.length > 0 && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Recommended for you</h2>
            </div>

            <div className={styles.similarGrid}>
              {similarProducts.map((item) => {
                const isSimilarInCart = items.some(
                  (cartItem) => cartItem.id === item.id,
                );

                return (
                  <div key={item.id} className={styles.similarCard}>
                    <Link
                      to={`/product/${item.id}`}
                      className={styles.cardLink}
                    >
                      <div className={styles.similarMedia}>
                        <img
                          src={item.thumbnail || item.images?.[0]}
                          alt={item.title}
                          className={styles.similarImg}
                        />
                      </div>

                      <div className={styles.similarBody}>
                        <div className={styles.similarCategory}>
                          {item.category}
                        </div>
                        <div className={styles.similarTitle}>{item.title}</div>
                        <div className={styles.similarBottom}>
                          <span className={styles.similarPrice}>
                            {formatMoney(item.price)}
                          </span>
                          <span className={styles.similarRating}>
                            ★ {Number(item.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {isSimilarInCart ? (
                      <Link to="/cart" className={styles.cardIconBtn}>
                        ✓
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={styles.cardIconBtn}
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {reviews.length > 0 && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Reviews</h2>
            </div>

            <div className={styles.reviewsWide}>
              {reviews.slice(0, 3).map((r, idx) => (
                <div
                  key={`${r.reviewerName || "r"}-${idx}`}
                  className={styles.review}
                >
                  <div className={styles.reviewTop}>
                    <span className={styles.reviewName}>
                      {r.reviewerName || "Anonymous"}
                    </span>
                    <span className={styles.reviewRate}>
                      ★ {Number(r.rating).toFixed(1)}
                    </span>
                  </div>
                  <div className={styles.reviewText}>{r.comment}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
