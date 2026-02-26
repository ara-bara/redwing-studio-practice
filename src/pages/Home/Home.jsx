import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productApi";
import styles from "./Home.module.scss";

function formatMoney(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  return `$${num.toFixed(2)}`;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const items = await getProducts(30);
        setProducts(items);
      } catch (e) {
        setError("No data received");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return [
      "all",
      ...Array.from(
        new Set(products.map((p) => p.category).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    ];
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = products;
    if (category !== "all") list = list.filter((f) => f.category === category);
    if (query !== "")
      list = list.filter((s) => {
        const title = (s.title || "").toLowerCase();
        const brand = (s.brand || "").toLowerCase();
        return title.includes(query) || brand.includes(query);
      });

    const copy = [...list];

    switch (sort) {
      case "new":
        copy.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "rating":
        copy.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case "price_asc":
        copy.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_desc":
        copy.sort((a, b) => Number(b.price) - Number(a.price));
        break;
    }

    return copy;
  }, [products, q, category, sort]);
  if (loading) return <div className={styles.center}>Loading…</div>;
  if (error) return <div className={styles.center}>{error}</div>;

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.h1}>Products</h1>
          </div>
          <div className={styles.count}>{filtered.length} items</div>
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
          <div className={styles.grid}>
            {filtered.map((p) => {
              const oldPrice = Number(p.price);
              const discount = Number(p.discountPercentage || 0);
              const hasDiscount = discount > 0;

              const priceNow = hasDiscount
                ? oldPrice * (1 - discount / 100)
                : oldPrice;

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
                        КУПИТИ ЗАРАЗ
                      </Link>

                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={() => console.log("Add to cart:", p.id)}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
