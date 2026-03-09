import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { calcCartSummary, calcItemPricing } from "../../utils/cartPricing";
import styles from "./Cart.module.scss";

export default function Cart() {
  const { items, setQty, removeFromCart } = useCart();

  const uniqueItems = items.length;
  const { totalDiscount, subtotal, totalWithDiscount, totalQty } =
    calcCartSummary(items);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.h1}>Cart</h1>
            <p className={styles.sub}>
              {uniqueItems} products • {totalQty} pcs
            </p>
          </div>

          <Link to="/" className={styles.close} aria-label="Close cart">
            ×
          </Link>
        </header>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>Cart is empty</div>
            <Link to="/" className={styles.primaryBtn}>
              Back to products
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.list}>
              {items.map((item) => {
                const { itemOldTotal, itemTotal } = calcItemPricing(item);

                return (
                  <article key={item.id} className={styles.row}>
                    <div className={styles.media}>
                      <img
                        className={styles.img}
                        src={item.thumbnail}
                        alt={item.title}
                        loading="lazy"
                      />
                    </div>

                    <div className={styles.info}>
                      <div className={styles.top}>
                        <h3 className={styles.title}>{item.title}</h3>

                        <div className={styles.priceBox}>
                          <div className={styles.priceCurrent}>
                            ${itemTotal.toFixed(2)}
                          </div>

                          <div className={styles.priceOld}>
                            ${itemOldTotal.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className={styles.controls}>
                        <div className={styles.qty}>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => setQty(item.id, item.qty - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span className={styles.qtyValue}>{item.qty}</span>

                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => setQty(item.id, item.qty + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className={styles.summary}>
              <div className={styles.summaryTitle}>Summary</div>

              <div className={styles.summaryRow}>
                <span className={styles.muted}>Products</span>
                <span>{uniqueItems}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.muted}>Total quantity</span>
                <span>{totalQty}</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.summaryRowTotal}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Discount</span>
                <span>${totalDiscount.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Total</span>
                <span>${totalWithDiscount.toFixed(2)}</span>
              </div>

              <Link to="/" className={styles.ghostBtn}>
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
