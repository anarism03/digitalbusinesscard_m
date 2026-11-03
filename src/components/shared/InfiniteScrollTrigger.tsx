import { Spin } from "antd";
import type { InfiniteScrollTriggerProps as Props } from "../../types/components/shared";

export default function InfiniteScrollTrigger({
  sentinelRef,
  isLoadingMore,
  hasMore,
}: Props) {
  if (!hasMore) return null;

  return (
    <div
      ref={sentinelRef}
      style={{ display: "flex", justifyContent: "center", padding: 20 }}
    >
      {isLoadingMore && <Spin size="small" />}
    </div>
  );
}
