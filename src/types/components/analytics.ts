import type { ScanChartPoint } from "..";

export interface ScanTrendChartProps {
  data?: ScanChartPoint[];
  loading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  tickFormatter?: (date: string) => string;
  headerLabel?: string;
}
