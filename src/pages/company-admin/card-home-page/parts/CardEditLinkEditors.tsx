import { CORE_LINK_META } from "../../../../constants/linkTypes";
import type { ContactInfo, SocialAccount } from "../../../../types";
import type { CardEditLinkEditorsProps as Props } from "../../../../types/pages/cardEditor";
import {
  contactInfoMeta,
  customWebsiteHeadline,
  customWebsitePlatformName,
  isWebsiteSocialAccount,
  linkMetaFor,
  resolveContactInfoType,
} from "../../../../utils/linkTypeResolution";
import {
  contactInfoRowKey,
  replaceLinkRowKey,
  socialAccountRowKey,
} from "../../../../utils/linkVisibility";
import { urlToUsername } from "../../../../utils/url";
import CoreFieldSheet from "./CoreFieldSheet";
import QuickLinkForm from "./QuickLinkForm";
import WebsiteLinkForm from "./WebsiteLinkForm";

export default function CardEditLinkEditors({
  editingRow,
  onEditingRowChange,
  contactInfos,
  setContactInfos,
  socialAccounts,
  setSocialAccounts,
  editingCore,
  onEditingCoreChange,
  address,
  onAddressChange,
  watch,
  setValue,
}: Props) {
  const editingContactInfo =
    editingRow?.kind === "contact" ? contactInfos[editingRow.index] : undefined;
  const editingSocialAccount =
    editingRow?.kind === "social"
      ? socialAccounts[editingRow.index]
      : undefined;
  const editingContactMeta = editingContactInfo
    ? contactInfoMeta(editingContactInfo)
    : undefined;
  const editingSocialMeta = editingSocialAccount
    ? linkMetaFor(editingSocialAccount.platformName)
    : undefined;

  const updateContactInfo = (index: number, next?: ContactInfo) => {
    setContactInfos((prev) => {
      const current = prev[index];
      if (!current) return prev;
      const infos = next
        ? prev.map((info, i) => (i === index ? next : info))
        : prev.filter((_, i) => i !== index);
      return replaceLinkRowKey(
        infos,
        contactInfoRowKey(current),
        next ? contactInfoRowKey(next) : undefined,
      );
    });
  };

  const updateSocialAccount = (index: number, next?: SocialAccount) => {
    const current = socialAccounts[index];
    if (!current) return;
    setSocialAccounts((prev) =>
      next
        ? prev.map((account, i) => (i === index ? next : account))
        : prev.filter((_, i) => i !== index),
    );
    setContactInfos((prev) =>
      replaceLinkRowKey(
        prev,
        socialAccountRowKey(current),
        next ? socialAccountRowKey(next) : undefined,
      ),
    );
  };

  return (
    <>
      {editingContactInfo &&
        editingContactMeta &&
        resolveContactInfoType(editingContactInfo) !== "website" && (
          <QuickLinkForm
            open
            title={editingContactMeta.title}
            icon={editingContactMeta.icon}
            iconSrc={editingContactMeta.iconSrc}
            placeholder={editingContactMeta.placeholder}
            fieldKind={editingContactMeta.fieldKind}
            urlPrefix={editingContactMeta.urlPrefix}
            initial={{
              label: editingContactInfo.label || editingContactMeta.title,
              value:
                editingContactMeta.fieldKind === "username" &&
                editingContactMeta.urlPrefix
                  ? urlToUsername(
                      editingContactMeta.urlPrefix,
                      editingContactInfo.value,
                    )
                  : editingContactInfo.value,
            }}
            onBack={() => onEditingRowChange(null)}
            onClose={() => onEditingRowChange(null)}
            onSave={(results) => {
              const result = results[0];
              if (!result) return;
              const index = editingRow!.index;
              updateContactInfo(index, { ...editingContactInfo, ...result });
              onEditingRowChange(null);
            }}
            onDelete={() => {
              updateContactInfo(editingRow!.index);
              onEditingRowChange(null);
            }}
          />
        )}

      {editingContactInfo &&
        resolveContactInfoType(editingContactInfo) === "website" && (
          <WebsiteLinkForm
            open
            initial={{
              headline: editingContactInfo.label || "Sayt linki",
              url: editingContactInfo.value,
            }}
            onBack={() => onEditingRowChange(null)}
            onClose={() => onEditingRowChange(null)}
            onSave={(result) => {
              const index = editingRow!.index;
              const account = {
                platformName: customWebsitePlatformName(result.headline),
                profileUrl: result.url,
                iconUrl: result.iconUrl,
              };
              setContactInfos((prev) =>
                replaceLinkRowKey(
                  prev.filter((_, i) => i !== index),
                  contactInfoRowKey(editingContactInfo),
                  socialAccountRowKey(account),
                ),
              );
              setSocialAccounts((prev) => [...prev, account]);
              onEditingRowChange(null);
            }}
            onDelete={() => {
              updateContactInfo(editingRow!.index);
              onEditingRowChange(null);
            }}
          />
        )}

      {editingSocialAccount &&
        editingSocialMeta &&
        !isWebsiteSocialAccount(editingSocialAccount) && (
          <QuickLinkForm
            open
            title={editingSocialMeta.title}
            icon={editingSocialMeta.icon}
            iconSrc={editingSocialMeta.iconSrc ?? editingSocialAccount.iconUrl}
            placeholder={editingSocialMeta.placeholder}
            fieldKind={editingSocialMeta.fieldKind}
            urlPrefix={editingSocialMeta.urlPrefix}
            initial={{
              label: editingSocialMeta.title,
              value:
                editingSocialMeta.fieldKind === "username" &&
                editingSocialMeta.urlPrefix
                  ? urlToUsername(
                      editingSocialMeta.urlPrefix,
                      editingSocialAccount.profileUrl,
                    )
                  : editingSocialAccount.profileUrl,
            }}
            onBack={() => onEditingRowChange(null)}
            onClose={() => onEditingRowChange(null)}
            onSave={(results) => {
              const result = results[0];
              if (!result) return;
              const index = editingRow!.index;
              setSocialAccounts((prev) => prev.filter((_, i) => i !== index));
              const info = {
                contactType: editingSocialAccount.platformName,
                value: result.value,
                label: result.label,
              };
              setContactInfos((prev) =>
                replaceLinkRowKey(
                  [...prev, info],
                  socialAccountRowKey(editingSocialAccount),
                  contactInfoRowKey(info),
                ),
              );
              onEditingRowChange(null);
            }}
            onDelete={() => {
              updateSocialAccount(editingRow!.index);
              onEditingRowChange(null);
            }}
          />
        )}

      {editingSocialAccount && isWebsiteSocialAccount(editingSocialAccount) && (
        <WebsiteLinkForm
          open
          initial={{
            headline:
              customWebsiteHeadline(editingSocialAccount.platformName) ??
              "Sayt linki",
            url: editingSocialAccount.profileUrl,
            iconUrl: editingSocialAccount.iconUrl,
          }}
          onBack={() => onEditingRowChange(null)}
          onClose={() => onEditingRowChange(null)}
          onSave={(result) => {
            const index = editingRow!.index;
            updateSocialAccount(index, {
              platformName: customWebsitePlatformName(result.headline),
              profileUrl: result.url,
              iconUrl: result.iconUrl,
            });
            onEditingRowChange(null);
          }}
          onDelete={() => {
            updateSocialAccount(editingRow!.index);
            onEditingRowChange(null);
          }}
        />
      )}

      {editingCore && (
        <CoreFieldSheet
          open
          title={CORE_LINK_META[editingCore].label}
          placeholder={CORE_LINK_META[editingCore].placeholder}
          fieldKind={CORE_LINK_META[editingCore].fieldKind}
          urlPrefix={CORE_LINK_META[editingCore].urlPrefix}
          initialValue={watch(editingCore) ?? ""}
          showHeadline={editingCore === "googleMapsUrl"}
          initialHeadline={address}
          onClose={() => onEditingCoreChange(null)}
          onSave={(value, headline) => {
            setValue(editingCore, value, { shouldDirty: true });
            if (editingCore === "googleMapsUrl")
              onAddressChange(headline ?? "");
            onEditingCoreChange(null);
          }}
          onDelete={
            editingCore === "googleMapsUrl" && watch(editingCore)
              ? () => {
                  setValue(editingCore, "", { shouldDirty: true });
                  onAddressChange("");
                  onEditingCoreChange(null);
                }
              : undefined
          }
        />
      )}
    </>
  );
}
