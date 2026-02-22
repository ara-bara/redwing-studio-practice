import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductSkeleton() {
  return (
    <SkeletonTheme baseColor="#2a2a2a" highlightColor="#3a3a3a">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Skeleton height={250} borderRadius={16} />
        <Skeleton height={32} width="60%" />
        <Skeleton height={24} width="30%" />
        <Skeleton count={3} />
      </div>
    </SkeletonTheme>
  );
}
