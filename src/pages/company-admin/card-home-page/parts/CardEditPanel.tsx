import { PlusOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { LINK_TYPE_META } from "../../../../constants/linkTypes";
import { styles } from "../../../../styles/company-admin/CardEditPanel.styles";
import type { CardEditPanelProps as Props } from "../../../../types/pages/cardEditor";
import { hasContactCardFields } from "../../../../utils/contactCardFields";
import { useCardEditor } from "../hooks/useCardEditor";
import CardEditLinkEditors from "./CardEditLinkEditors";
import CardEditLinkList from "./CardEditLinkList";
import CardHero from "./CardHero";
import ContactCardForm from "./ContactCardForm";
import LinkTypePicker from "./LinkTypePicker";
import QuickLinkForm from "./QuickLinkForm";
import WebsiteLinkForm from "./WebsiteLinkForm";

export default function CardEditPanel(props: Props) {
  const {
    employee,
    control,
    handleSubmit,
    watch,
    setValue,
    errors,
    updateProfile,
    updateEmployee,
    photo,
    background,
    avatarSrc,
    backgroundPreview,
    companyLogoSrc,
    backgroundSrc,
    avatarFileInputRef,
    backgroundFileInputRef,
    contactInfos,
    setContactInfos,
    socialAccounts,
    setSocialAccounts,
    contactCardFields,
    contactCardEnabled,
    addStep,
    setAddStep,
    quickLinkType,
    editingRow,
    setEditingRow,
    editingCore,
    setEditingCore,
    contactFormOpen,
    setContactFormOpen,
    address,
    setAddress,
    fullNameInput,
    fullName,
    contactCardFormDefaults,
    handleFullNameChange,
    handleAddSelect,
    handleQuickLinkSave,
    handleWebsiteLinkSave,
    handleCancel,
    onValid,
    editAvatar,
    editBackground,
    removeAvatar,
    removeBackground,
    saveContactCard,
    deleteContactCard,
  } = useCardEditor(props);

  return (
    <div style={styles.wrap}>
      <CardHero
        name={employee.fullName}
        avatarSrc={avatarSrc}
        backgroundSrc={backgroundSrc}
        isCompanyLogoCover={!backgroundPreview && Boolean(companyLogoSrc)}
        onEditAvatar={editAvatar}
        onEditBackground={editBackground}
        onRemoveAvatar={photo.src ? removeAvatar : undefined}
        onRemoveBackground={background.src ? removeBackground : undefined}
      />

      <input
        ref={avatarFileInputRef}
        type="file"
        accept="image/*"
        style={styles.hiddenInput}
        onChange={photo.onInputChange}
      />
      <input
        ref={backgroundFileInputRef}
        type="file"
        accept="image/*"
        style={styles.hiddenInput}
        onChange={background.onInputChange}
      />

      <div style={styles.identityField}>
        <span style={styles.fieldLabel}>Tam Ad</span>
        <Input
          aria-label="Tam Ad"
          className={`card-edit-flat-input ${
            errors.firstName || errors.lastName
              ? "card-edit-flat-input--error"
              : ""
          }`}
          value={fullNameInput}
          onChange={(event) => handleFullNameChange(event.target.value)}
          placeholder="Ad Soyad"
          maxLength={101}
          style={{
            ...styles.flatInput,
            ...(errors.firstName || errors.lastName
              ? styles.flatInputError
              : {}),
          }}
        />
      </div>

      <CardEditLinkList
        employee={employee}
        contactInfos={contactInfos}
        setContactInfos={setContactInfos}
        socialAccounts={socialAccounts}
        contactCardFields={contactCardFields}
        contactCardEnabled={contactCardEnabled}
        fullName={fullName}
        additionalInfo={watch("additionalInfo") ?? ""}
        address={address}
        control={control}
        onOpenContactCard={() => setContactFormOpen(true)}
        onEditCore={setEditingCore}
        onEditRow={setEditingRow}
      />

      <LinkTypePicker
        open={addStep === "picker"}
        onClose={() => setAddStep(null)}
        onSelect={handleAddSelect}
      />

      <ContactCardForm
        open={contactFormOpen}
        initial={contactCardFormDefaults}
        firstName={watch("firstName") ?? ""}
        lastName={watch("lastName") ?? ""}
        middleName={watch("middleName") ?? ""}
        onClose={() => setContactFormOpen(false)}
        onSave={saveContactCard}
        onDelete={
          hasContactCardFields(contactCardFields)
            ? deleteContactCard
            : undefined
        }
      />

      <QuickLinkForm
        key={quickLinkType}
        open={addStep === quickLinkType}
        title={LINK_TYPE_META[quickLinkType].title}
        icon={LINK_TYPE_META[quickLinkType].icon}
        iconSrc={LINK_TYPE_META[quickLinkType].iconSrc}
        placeholder={LINK_TYPE_META[quickLinkType].placeholder}
        fieldKind={LINK_TYPE_META[quickLinkType].fieldKind}
        urlPrefix={LINK_TYPE_META[quickLinkType].urlPrefix}
        allowMultiple={quickLinkType === "phone" || quickLinkType === "email"}
        onBack={() => setAddStep("picker")}
        onClose={() => setAddStep(null)}
        onSave={(results) => handleQuickLinkSave(quickLinkType, results)}
      />

      <WebsiteLinkForm
        open={addStep === "website"}
        onBack={() => setAddStep("picker")}
        onClose={() => setAddStep(null)}
        onSave={handleWebsiteLinkSave}
      />

      <CardEditLinkEditors
        editingRow={editingRow}
        onEditingRowChange={setEditingRow}
        contactInfos={contactInfos}
        setContactInfos={setContactInfos}
        socialAccounts={socialAccounts}
        setSocialAccounts={setSocialAccounts}
        editingCore={editingCore}
        onEditingCoreChange={setEditingCore}
        address={address}
        onAddressChange={setAddress}
        watch={watch}
        setValue={setValue}
      />

      <div style={styles.bottomBar}>
        <button
          type="button"
          style={styles.addLinkButton}
          onClick={() => setAddStep("picker")}
        >
          <PlusOutlined /> Əlavə et
        </button>

        <div style={styles.actions}>
          <Button onClick={handleCancel}>Ləğv et</Button>
          <Button
            type="primary"
            loading={
              updateProfile.isPending ||
              updateEmployee.isPending ||
              photo.isProcessing ||
              background.isProcessing
            }
            onClick={handleSubmit(onValid)}
          >
            Yadda saxla
          </Button>
        </div>
      </div>
    </div>
  );
}
