import { TrophyOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Segmented, Select, Switch } from "antd";
import { lazy, Suspense } from "react";
import AssetAvatar from "../../../../components/shared/AssetAvatar";
import CountUp from "../../../../components/shared/CountUp";
import RangeCalendarPicker from "../../../../components/shared/RangeCalendarPicker";
import { PERIOD_OPTIONS } from "../../../../constants/analytics";
import { strings } from "../../../../constants/strings";
import { styles } from "../../../../styles/company-admin/StatisticsPage.styles";
import type { PeriodPreset } from "../../../../types";
import type { StatsOverviewSectionProps as Props } from "../../../../types/pages/companyAdmin";
import { useStatsOverview } from "../hooks/useStatsOverview";

const ScanTrendChart = lazy(
  () => import("../../../../components/analytics/ScanTrendChart"),
);

export default function StatsOverviewSection({ onSelectEmployee }: Props) {
  const {
    preset,
    employeeId,
    onlyActive,
    setOnlyActive,
    employees,
    setDashboardParams,
    calendarFrom,
    calendarTo,
    totalScans,
    countLoading,
    countError,
    refetch,
    previousScans,
    previousLoading,
    previousError,
    retryComparison,
    rankingLoading,
    rankingError,
    retryRanking,
    activeEmployeeCount,
    averageScanCount,
    scanDifference,
    changeColor,
    changeLabel,
    displayChartData,
    displayChartLoading,
    displayChartError,
    retryChart,
    chartTickFormatter,
    headerRangeLabel,
    filteredRanking,
    maxScanCount,
  } = useStatsOverview();
  return (
    <div>
      <Segmented
        value={preset}
        onChange={(v) =>
          setDashboardParams({
            period: v as PeriodPreset,
            from: null,
            to: null,
          })
        }
        block
        className="stats-period-segmented"
        style={styles.periodSegmented}
        options={PERIOD_OPTIONS}
      />

      <RangeCalendarPicker
        from={calendarFrom}
        to={calendarTo}
        onChange={(from, to) => setDashboardParams({ from, to })}
        className="stats-filter-field"
        style={styles.filterField}
      />

      <Select
        value={employeeId}
        onChange={(v) => setDashboardParams({ statsEmployeeId: v })}
        allowClear
        placeholder="Bütün əməkdaşlar"
        size="large"
        className="stats-filter-field"
        style={styles.filterField}
        options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
      />

      <Card style={styles.toggleCard} styles={{ body: styles.toggleBody }}>
        <span style={styles.activeOnlyLabel}>Reytinqdə yalnız aktivlər</span>
        <Switch checked={onlyActive} onChange={setOnlyActive} />
      </Card>

      <div style={styles.statGrid}>
        <Card
          loading={countLoading}
          style={styles.statCard}
          styles={{ body: styles.statCardBody }}
        >
          <p style={styles.statLabel}>Ümumi skan</p>
          <p style={styles.statValue}>
            {countError ? "—" : <CountUp value={totalScans ?? 0} />}
          </p>
          <p style={styles.statCaption}>{headerRangeLabel}</p>
          {countError && (
            <Button
              size="small"
              style={styles.retryButton}
              onClick={() => refetch()}
              aria-label="Skan sayını yenidən yüklə"
            >
              {strings.common.tryAgain}
            </Button>
          )}
        </Card>
        <Card style={styles.statCard} styles={{ body: styles.statCardBody }}>
          <p style={styles.statLabel}>Aktiv vizitkart</p>
          <p style={styles.statValue}>{activeEmployeeCount}</p>
          <p style={styles.statCaption}>{employees.length} əməkdaşdan</p>
        </Card>
        <Card
          loading={countLoading}
          style={styles.statCard}
          styles={{ body: styles.statCardBody }}
        >
          <p style={styles.statLabel}>Ortalama skan</p>
          <p style={styles.statValue}>{countError ? "—" : averageScanCount}</p>
          <p style={styles.statCaption}>
            {employeeId ? "seçilmiş əməkdaş üçün" : "hazırkı əməkdaş başına"}
          </p>
        </Card>
        <Card
          loading={countLoading || previousLoading}
          style={styles.statCard}
          styles={{ body: styles.statCardBody }}
        >
          <p style={styles.statLabel}>Ötən dövrlə müqayisə</p>
          <p
            style={{
              ...styles.statValue,
              ...styles.changeValue,
              color: changeColor,
            }}
          >
            {!countError && !previousError && scanDifference !== 0 && (
              <span style={styles.changeArrow} aria-hidden="true">
                {scanDifference > 0 ? "↑" : "↓"}
              </span>
            )}
            {countError || previousError ? "—" : changeLabel}
          </p>
          <p style={styles.statCaption}>
            {countError || previousError
              ? "Müqayisə yüklənmədi"
              : `Ötən dövr: ${previousScans ?? 0} skan`}
          </p>
          {previousError && (
            <Button
              size="small"
              style={styles.retryButton}
              onClick={() => retryComparison()}
              aria-label="Ötən dövrün skan sayını yenidən yüklə"
            >
              {strings.common.tryAgain}
            </Button>
          )}
        </Card>
      </div>

      <div style={styles.dashboardGrid}>
        <Suspense fallback={<Card loading />}>
          <ScanTrendChart
            data={displayChartData}
            loading={displayChartLoading}
            errorMessage={displayChartError}
            onRetry={retryChart}
            tickFormatter={chartTickFormatter}
            headerLabel={headerRangeLabel}
          />
        </Suspense>

        <Card
          title={
            <span style={styles.rankingTitle}>
              <TrophyOutlined style={styles.trophyIcon} />
              Əməkdaş reytinqi
            </span>
          }
          loading={rankingLoading}
        >
          {rankingError ? (
            <Empty description="Əməkdaş reytinqi yüklənmədi">
              <Button
                onClick={() => retryRanking()}
                aria-label="Əməkdaş reytinqini yenidən yüklə"
              >
                {strings.common.tryAgain}
              </Button>
            </Empty>
          ) : filteredRanking.length === 0 ? (
            <div>Hələlik məlumat yoxdur</div>
          ) : (
            filteredRanking.map((row, idx) => (
              <button
                key={row.employeeId}
                type="button"
                onClick={() => onSelectEmployee(row.employeeId)}
                style={{
                  ...styles.rankingButton,
                  borderBottom:
                    idx === filteredRanking.length - 1
                      ? "none"
                      : styles.rankingButton.borderBottom,
                }}
              >
                <span style={styles.rankingIndex}>{idx + 1}</span>
                <AssetAvatar
                  src={row.photoUrl}
                  name={row.fullName}
                  size={40}
                  style={styles.rankingAvatar}
                />
                <div style={styles.rankingInfo}>
                  <div style={styles.rankingName}>{row.fullName}</div>
                  {row.jobTitle && (
                    <div style={styles.rankingJob}>{row.jobTitle}</div>
                  )}
                  <div style={styles.rankingBarTrack}>
                    <div
                      style={{
                        ...styles.rankingBarFill,
                        width: `${(row.scanCount / maxScanCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span style={styles.scanCount}>{row.scanCount}</span>
              </button>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
