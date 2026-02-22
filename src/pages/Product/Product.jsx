import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsById } from "../../services/productApi";
import ProductSkeleton from "./ProductSkeleton";

export default function Product() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    async function loadById() {
      setProduct(null);
      setLoading(true);
      setError("");
      try {
        const item = await getProductsById(id);
        setProduct(item);
        console.log(item);
      } catch (err) {
        setError("No received data");
      } finally {
        setLoading(false);
      }
    }
    loadById(id);
  }, [id]);

  if (error) return <h2>{error}</h2>;
  if (loading || (!product && !error)) {
    return <ProductSkeleton />;
  }
  return (
    <div>
      <div>{product.title}</div>
      <div>{product.price}</div>
      <div>{product.description}</div>
    </div>
  );
}
