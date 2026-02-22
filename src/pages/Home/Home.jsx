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
        setError("No received data");
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
        <div className={styles.grid}>
          {products.map((item) => {
            const img = item.thumbnail || item.image;
            return (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className={styles.card}
              >
                <div className={styles.imgWrap}>
                  <img src={img} alt={item.title} />
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.price}>${item.price}</p>
                  <p className={styles.desc}>{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
