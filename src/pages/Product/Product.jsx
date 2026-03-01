import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import { calcPricing } from "../../utils/pricing";
import { getProductsById } from "../../utils/productApi";
import styles from "./Product.module.scss";
import ProductSkeleton from "./ProductSkeleton";
export default function Product() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const item = await getProductsById(id);
        setProduct(item);
        console.log(item);
      } catch (e) {
        setError("No received data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const pricing = useMemo(() => {
    if (!product) return null;
    return calcPricing(product.price, product.discountPercentage);
  }, [product]);

  if (error) return <div className={styles.center}>{error}</div>;
  if (loading || (!product && !error)) return <ProductSkeleton />;

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
            <div className={styles.media}>
              <img className={styles.img} src={imgSrc} alt={product.title} />
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

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => console.log("Add to cart:", product.id)}
            >
              + ADD TO CART
            </button>

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

            {reviews.length > 0 && (
              <div className={styles.block}>
                <div className={styles.blockTitle}>Reviews</div>
                <div className={styles.reviews}>
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
        </div>
      </div>
    </section>
  );
}
