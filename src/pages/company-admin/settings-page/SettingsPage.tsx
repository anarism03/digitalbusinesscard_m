import { EditOutlined } from "@ant-design/icons";
import { Card, Switch } from "antd";
import { Fragment, useEffect, useMemo, useState } from "react";
import AssetAvatar from "../../../components/shared/AssetAvatar";
import EmptyState from "../../../components/shared/EmptyState";
import ErrorState from "../../../components/shared/ErrorState";
import InfiniteScrollTrigger from "../../../components/shared/InfiniteScrollTrigger";
import PageHeader from "../../../components/shared/PageHeader";
import { strings } from "../../../constants/strings";
import { SIZES } from "../../../constants/ui";
import { useSetEmployeeCanEdit } from "../../../hooks/useEmployees";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { employeesService } from "../../../services/employees.service";
import { useAppSelector } from "../../../store/hooks";
import { styles } from "../../../styles/company-admin/SettingsPage.styles";
import type { Employee } from "../../../types";
import { mapEmployeePage } from "../../../utils/mappers";
import AppearanceSettingsCard from "./parts/AppearanceSettingsCard";
import CompanySettingsCard from "./parts/CompanySettingsCard";

export default function SettingsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const companyId = user?.companyId ?? "";

  const {
    items: employees,
    totalCount,
    isLoading,
    isLoadingMore,
    isError,
    hasMore,
    sentinelRef,
    refetch,
  } = useInfiniteScroll<Employee>(
    (page) =>
      employeesService
        .getByCompany(companyId, page, SIZES.tablePageSize)
        .then(mapEmployeePage),
    [companyId],
  );
  const setCanEdit = useSetEmployeeCanEdit();
  const usedCount = isLoading ? null : totalCount;

  const sortedEmployees = useMemo(
    () =>
      [...employees].sort((a, b) => {
        if (a.id === user?.id) return -1;
        if (b.id === user?.id) return 1;
        return 0;
      }),
    [employees, user?.id],
  );

  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOverrides((previous) => {
      const pending = Object.entries(previous).filter(
        ([id, value]) =>
          !employees.some((row) => row.id === id && row.canEdit === value),
      );
      return pending.length === Object.keys(previous).length
        ? previous
        : Object.fromEntries(pending);
    });
  }, [employees]);

  const clearOverride = (id: string) =>
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const handleToggle = (id: string, checked: boolean) => {
    if (pendingIds[id]) return;
    setPendingIds((prev) => ({ ...prev, [id]: true }));
    setOverrides((prev) => ({ ...prev, [id]: checked }));
    setCanEdit.mutate(
      { id, canEdit: checked },
      {
        onSuccess: () => {
          void refetch();
        },
        onError: () => clearOverride(id),
        onSettled: () =>
          setPendingIds((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          }),
      },
    );
  };

  return (
    <div>
      <PageHeader title={strings.settings.title} />

      <AppearanceSettingsCard />

      <CompanySettingsCard usedCount={usedCount} />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <Card
          style={styles.card}
          title={
            <span style={styles.cardTitle}>
              <span style={styles.cardTitleIconBadge}>
                <EditOutlined style={styles.cardTitleIcon} />
              </span>
              Əməkdaş redaktə icazələri
            </span>
          }
        >
          <p style={styles.hint}>
            İcazəsi olan əməkdaş öz vizitkart məlumatlarını redaktə edə bilər.
          </p>

          {sortedEmployees.length === 0 && !isLoading ? (
            <EmptyState description={strings.employees.empty} />
          ) : (
            <div style={styles.tableGrid}>
              <span
                style={{
                  ...styles.tableHeaderCell,
                  ...styles.tableHeaderCellFirst,
                }}
              >
                Əməkdaş
              </span>
              <span
                style={{
                  ...styles.tableHeaderCell,
                  ...styles.tableHeaderCenter,
                  ...styles.tableHeaderCellLast,
                }}
              >
                İcazə
              </span>

              {sortedEmployees.map((row, idx) => {
                const isLastRow = idx === sortedEmployees.length - 1;
                const cellStyle = isLastRow
                  ? { ...styles.tableCell, borderBottom: "none" }
                  : styles.tableCell;
                return (
                  <Fragment key={row.id}>
                    <div style={{ ...cellStyle, ...styles.tableCellFirst }}>
                      <div style={styles.employeeRow}>
                        <AssetAvatar
                          src={row.photoUrl}
                          name={row.fullName}
                          size={34}
                          style={styles.employeeAvatar}
                        />
                        <div style={styles.employeeTextCol}>
                          <div
                            className="settings-scroll-text"
                            style={styles.employeeName}
                          >
                            {row.fullName}
                          </div>
                          <div
                            className="settings-scroll-text"
                            style={styles.employeeEmail}
                          >
                            {row.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ ...cellStyle, ...styles.tableCellLast }}>
                      <div style={styles.tableCellCenter}>
                        {row.id === user?.id ? (
                          <span style={styles.adminPill}>Admin</span>
                        ) : (
                          <Switch
                            checked={overrides[row.id] ?? row.canEdit ?? false}
                            loading={Boolean(pendingIds[row.id])}
                            onChange={(checked) =>
                              handleToggle(row.id, checked)
                            }
                          />
                        )}
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          )}
          {isLoading && employees.length === 0 && (
            <p style={styles.hint}>Yüklənir...</p>
          )}

          {totalCount > 0 && (
            <p style={styles.tableFooter}>
              {strings.common.total} {totalCount} əməkdaş
            </p>
          )}

          <InfiniteScrollTrigger
            sentinelRef={sentinelRef}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
          />
        </Card>
      )}
    </div>
  );
}
