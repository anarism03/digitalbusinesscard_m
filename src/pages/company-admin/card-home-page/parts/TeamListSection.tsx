import {
  CheckOutlined,
  InboxOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Badge, Button, Input, Tabs, Tooltip } from "antd";
import ChangePasswordModal from "../../../../components/auth/ChangePasswordModal";
import ConfirmActionModal from "../../../../components/shared/ConfirmActionModal";
import EmptyState from "../../../../components/shared/EmptyState";
import ErrorState from "../../../../components/shared/ErrorState";
import ImagePreviewModal from "../../../../components/shared/ImagePreviewModal";
import InfiniteScrollTrigger from "../../../../components/shared/InfiniteScrollTrigger";
import LoadingSkeleton from "../../../../components/shared/LoadingSkeleton";
import PageHeader from "../../../../components/shared/PageHeader";
import ShareProfileSheet from "../../../../components/shared/ShareProfileSheet";
import { strings } from "../../../../constants/strings";
import { styles } from "../../../../styles/company-admin/TeamListSection.styles";
import type { EmployeeStatusTab } from "../../../../types";
import type { TeamListSectionProps as Props } from "../../../../types/pages/cardEditor";
import { useTeamListSection } from "../hooks/useTeamListSection";
import EmployeeIdentifiersModal from "../modals/EmployeeIdentifiersModal";
import ResetPasswordModal from "../modals/ResetPasswordModal";
import ResetPasswordSuccessModal from "../modals/ResetPasswordSuccessModal";
import EmployeeListCard from "./EmployeeListCard";

const s = strings.employees;

export default function TeamListSection({ onSelectEmployee }: Props) {
  const {
    navigate,
    user,
    activeTab,
    searchQuery,
    confirmEmployee,
    closeConfirm,
    previewEmployee,
    setPreviewEmployee,
    shareEmployee,
    setShareEmployee,
    identifiersEmployee,
    setIdentifiersEmployee,
    resetEmployee,
    setResetEmployee,
    resetSuccessPassword,
    setResetSuccessPassword,
    changeOwnPasswordOpen,
    setChangeOwnPasswordOpen,
    isLoading,
    isError,
    refetch,
    setActive,
    resetPassword,
    archivedCount,
    limit,
    usedCount,
    limitReached,
    totalCount,
    pageItems,
    hasMore,
    sentinelRef,
    setEmployeeParams,
    handleView,
    handleEdit,
    handleToggleActive,
    handleConfirmToggle,
    handleResetPassword,
    handleDownloadVcf,
    openChangeOwnPassword,
  } = useTeamListSection(onSelectEmployee);

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div style={styles.pageRoot}>
      <PageHeader
        title="Əməkdaşlar"
        extra={
          <div style={styles.headerActions}>
            <Tooltip
              title={
                limitReached
                  ? `Şirkətiniz əməkdaş limitinə çatıb (Maksimum: ${limit})`
                  : undefined
              }
            >
              <Button
                type="primary"
                className="brand-white-button"
                icon={<PlusOutlined />}
                disabled={limitReached}
                onClick={() => navigate("/admin/employees/new")}
              >
                {s.createButton}
              </Button>
            </Tooltip>
          </div>
        }
      />

      <Input
        value={searchQuery}
        onChange={(e) => setEmployeeParams({ q: e.target.value || null }, true)}
        allowClear
        placeholder="Ad və ya vəzifə axtar"
        prefix={<SearchOutlined style={styles.searchIcon} />}
        size="large"
        style={styles.searchInput}
      />

      {limit != null && limit > 0 && (
        <div style={styles.licenseCard}>
          <div style={styles.licenseHeaderRow}>
            <span style={styles.licenseTitle}>Əməkdaş limiti</span>
            <span style={styles.licenseCount}>
              {usedCount} / {limit}
            </span>
          </div>
          <div style={styles.licenseTrack}>
            <span
              style={{
                ...styles.licenseFill,
                width: `${Math.min(100, (usedCount / limit) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      <Tabs
        activeKey={activeTab}
        onChange={(key) =>
          setEmployeeParams({ status: key as EmployeeStatusTab })
        }
        items={[
          {
            key: "active",
            label: (
              <span>
                <CheckOutlined style={styles.tabIcon} />
                {s.tabs.active}
              </span>
            ),
          },
          {
            key: "inactive",
            label: (
              <span>
                <InboxOutlined style={styles.tabIcon} />
                {s.tabs.archive}
                {archivedCount > 0 && (
                  <Badge
                    count={archivedCount}
                    size="small"
                    style={styles.archiveBadge}
                  />
                )}
              </span>
            ),
          },
        ]}
      />

      {activeTab === "inactive" && (
        <div style={styles.archivedHint}>
          <InboxOutlined style={styles.tabIcon} />
          {s.archivedHint}
        </div>
      )}

      <div key={activeTab} className="page-fade" style={styles.listArea}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : pageItems.length === 0 ? (
          <EmptyState
            description={
              searchQuery.trim()
                ? "Axtarışa uyğun əməkdaş tapılmadı"
                : activeTab === "inactive"
                  ? "Arxivdə əməkdaş yoxdur"
                  : usedCount > 0
                    ? "Aktiv əməkdaş yoxdur"
                    : s.empty
            }
          />
        ) : (
          pageItems.map((employee) => (
            <EmployeeListCard
              key={employee.id}
              employee={employee}
              isCurrentUser={employee.id === user?.id}
              onView={handleView}
              onEdit={handleEdit}
              onPreviewAvatar={setPreviewEmployee}
              onToggleActive={handleToggleActive}
              onShare={setShareEmployee}
              onShowIdentifiers={setIdentifiersEmployee}
              onResetPassword={setResetEmployee}
              onChangeOwnPassword={openChangeOwnPassword}
              onDownloadVcf={handleDownloadVcf}
            />
          ))
        )}

        {totalCount > 0 && (
          <InfiniteScrollTrigger
            sentinelRef={sentinelRef}
            isLoadingMore={false}
            hasMore={hasMore}
          />
        )}
      </div>

      <ConfirmActionModal
        open={Boolean(confirmEmployee)}
        title={
          confirmEmployee?.isActive
            ? strings.common.deactivate
            : strings.common.activate
        }
        message={
          confirmEmployee?.isActive ? s.confirmDeactivate : s.confirmActivate
        }
        loading={setActive.isPending}
        danger={Boolean(confirmEmployee?.isActive)}
        cancelButtonClassName={
          !confirmEmployee?.isActive ? "confirm-cancel-button-red" : ""
        }
        onConfirm={handleConfirmToggle}
        onCancel={closeConfirm}
      />

      <ImagePreviewModal
        open={Boolean(previewEmployee)}
        src={previewEmployee?.photoUrl}
        title={previewEmployee?.fullName}
        onClose={() => setPreviewEmployee(null)}
      />

      {shareEmployee && (
        <ShareProfileSheet
          open
          onClose={() => setShareEmployee(null)}
          employee={shareEmployee}
        />
      )}

      <EmployeeIdentifiersModal
        employee={identifiersEmployee}
        onClose={() => setIdentifiersEmployee(null)}
      />

      <ResetPasswordModal
        open={Boolean(resetEmployee)}
        loading={resetPassword.isPending}
        onClose={() => setResetEmployee(null)}
        onReset={handleResetPassword}
      />
      <ResetPasswordSuccessModal
        password={resetSuccessPassword}
        onClose={() => setResetSuccessPassword(null)}
      />

      <ChangePasswordModal
        open={changeOwnPasswordOpen}
        onClose={() => setChangeOwnPasswordOpen(false)}
      />
    </div>
  );
}
