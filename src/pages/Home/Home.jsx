import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productApi";
import styles from "./Home.module.scss";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const items = await getProducts(12);
        setProducts(items);
      } catch (err) {
        setError("No data received");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) return <h2 className={styles.center}>Loading...</h2>;
  if (error) return <h2 className={styles.center}>{error}</h2>;
  if (!products.length) return <h2 className={styles.center}>No products</h2>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.h1}>Products</h1>
            <p className={styles.sub}>Curated picks — clean store layout</p>
          </div>
        </div>

        <div className={styles.grid}>
          {products.map((item) => {
            const img = item.thumbnail || item.image;
            const category = item.category || "Product";

            return (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className={styles.card}
              >
                <div className={styles.media}>
                  <span className={styles.badge}>{category}</span>
                  <span className={styles.pricePill}>${item.price}</span>
                  <div className={styles.imgWrap}>
                    <img className={styles.img} src={img} alt={item.title} />
                  </div>
                </div>

                <div className={styles.body}>
                  <h3 className={styles.name}>{item.title}</h3>
                  <p className={styles.desc}>{item.description}</p>

                  <div className={styles.actions}>
                    <button
                      className={styles.addBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("add to cart", item.id);
                      }}
                    >
                      Add to cart
                    </button>

                    <button
                      className={styles.detailsBtn}
                      aria-label="Open details"
                      title="Details"
                    >
                      →
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
