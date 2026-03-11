import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatMoney } from "../../utils/formatMoney";
import { calcPricing } from "../../utils/pricing";
import { getProducts } from "../../utils/productApi";
import {
  filterProducts,
  getCategories,
  sortProducts,
} from "../../utils/products";

import styles from "./Home.module.scss";

export default function Home() {
  const { addToCart, items } = useCart();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [visibleProducts, setVisibleProducts] = useState(12);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const items = await getProducts(194);
        setProducts(items);
      } catch (e) {
        setError("No data received");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => getCategories(products), [products]);

  const filtered = useMemo(() => {
    const afterFilter = filterProducts(products, { q, category });
    return sortProducts(afterFilter, sort);
  }, [products, q, category, sort]);

  useEffect(() => {
    setVisibleProducts(12);
  }, [q, category, sort]);

  if (loading) return <div className={styles.center}>Loading…</div>;
  if (error) return <div className={styles.center}>{error}</div>;

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.h1}>Products</h1>
            <p className={styles.sub}>
              {Math.min(visibleProducts, filtered.length)} / {filtered.length}{" "}
              items
            </p>
          </div>
        </header>

        <div className={styles.toolbar}>
          <label className={`${styles.search} ${styles.searchArea}`}>
            <span className={styles.searchLabel}>Search</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or brand…"
              className={styles.input}
            />
          </label>

          <label className={`${styles.selectWrap} ${styles.categoryArea}`}>
            <span className={styles.selectLabel}>Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All" : c}
                </option>
              ))}
            </select>
          </label>

          <label className={`${styles.selectWrap} ${styles.sortArea}`}>
            <span className={styles.selectLabel}>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={styles.select}
            >
              <option value="featured">Featured</option>
              <option value="new">New</option>
              <option value="rating">Top rated</option>
              <option value="price_asc">Price: low → high</option>
              <option value="price_desc">Price: high → low</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>Nothing found.</div>
        ) : (
          <>
            <div className={styles.grid}>
              {filtered.slice(0, visibleProducts).map((p) => {
                const { oldPrice, discount, hasDiscount, priceNow } =
                  calcPricing(p.price, p.discountPercentage);

                const isInCart = items.some((item) => item.id === p.id);

                const cartButton = isInCart ? (
                  <Link to="/cart" className={styles.ghostBtn}>
                    In cart
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => addToCart(p)}
                  >
                    + Add
                  </button>
                );

                return (
                  <article key={p.id} className={styles.item}>
                    <Link
                      to={`/product/${p.id}`}
                      className={styles.mediaLink}
                      aria-label={p.title}
                    >
                      <div className={styles.media}>
                        {hasDiscount && (
                          <span className={styles.badge}>
                            -{Math.round(discount)}%
                          </span>
                        )}

                        {p.stock < 10 && (
                          <span className={styles.badgeAlt}>LOW</span>
                        )}

                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          loading="lazy"
                          className={styles.img}
                        />
                      </div>
                    </Link>

                    <div className={styles.info}>
                      <div className={styles.topLine}>
                        <div className={styles.title}>
                          <Link
                            to={`/product/${p.id}`}
                            className={styles.titleLink}
                          >
                            {p.title}
                          </Link>
                        </div>

                        <div className={styles.price}>
                          <span className={styles.priceNow}>
                            {formatMoney(priceNow)}
                          </span>

                          {hasDiscount && (
                            <span className={styles.priceOld}>
                              {formatMoney(oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.meta}>
                        {p.brand && (
                          <>
                            <span className={styles.brand}>{p.brand}</span>
                            <span className={styles.dot}>•</span>
                          </>
                        )}
                        <span className={styles.rating}>
                          ★ {Number(p.rating).toFixed(1)}
                        </span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.stock}>{p.stock} in stock</span>
                      </div>

                      <div className={styles.actions}>
                        <Link
                          to={`/product/${p.id}`}
                          className={styles.primaryBtn}
                        >
                          SEE MORE
                        </Link>

                        {cartButton}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {visibleProducts < filtered.length && (
              <button
                type="button"
                className={styles.loadMoreBtn}
                onClick={() => setVisibleProducts((prev) => prev + 12)}
              >
                Show more ({Math.min(12, filtered.length - visibleProducts)})
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
