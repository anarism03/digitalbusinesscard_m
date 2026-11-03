import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { PROFILE_FIELD_OPTIONS } from "../../../../constants/cardEditor";
import { useAssetSrc } from "../../../../hooks/useAssetSrc";
import { useUpdateEmployee } from "../../../../hooks/useEmployees";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import { useUpdateProfile } from "../../../../hooks/useUser";
import type {
  ContactCardFormValues,
  ContactInfo,
  CoreLinkKey,
  EditingRow,
  LinkType,
  QuickLinkResult,
  SocialAccount,
  WebsiteLinkResult,
} from "../../../../types";
import type {
  ContactCardFormNameParts,
  CardEditPanelProps as Props,
  QuickLinkType,
} from "../../../../types/pages/cardEditor";
import {
  buildContactCardEntries,
  getContactCardFields,
  isContactCardEnabled,
  isContactCardField,
  normalizeContactCardButtonLabel,
  normalizeContactCardEntries,
} from "../../../../utils/contactCardFields";
import { customWebsitePlatformName } from "../../../../utils/linkTypeResolution";
import {
  buildProfileUpdate,
  getProfileDefaults,
  parseFullNameInput,
} from "../../../../utils/profileEditor";
import {
  profileEditSchema,
  type ProfileEditValues,
} from "../../../../validators/employee";

export function useCardEditor({
  employee,
  isOwnCard,
  onCancel,
  onSaved,
}: Props) {
  const defaults = useMemo(() => getProfileDefaults(employee), [employee]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: defaults,
  });

  const updateProfile = useUpdateProfile();
  const updateEmployee = useUpdateEmployee();
  const photo = useImageUpload({ initialSrc: employee.photoUrl });
  const background = useImageUpload({ initialSrc: employee.cardBackgroundUrl });
  const { reset: resetPhoto } = photo;
  const { reset: resetBackground } = background;
  const avatarSrc = useAssetSrc(photo.src);
  const backgroundPreview = useAssetSrc(background.src);
  const companyLogoSrc = useAssetSrc(employee.companyLogoUrl);
  const backgroundSrc = backgroundPreview || companyLogoSrc;
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  const [contactInfos, setContactInfos] = useState<ContactInfo[]>(() =>
    normalizeContactCardEntries(employee.contactInfos),
  );
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(
    employee.socialAccounts ?? [],
  );
  const contactCardFields = useMemo(
    () => getContactCardFields(contactInfos),
    [contactInfos],
  );
  const contactCardEnabled = isContactCardEnabled(contactInfos);

  const [addStep, setAddStep] = useState<"picker" | LinkType | null>(null);
  const [quickLinkType, setQuickLinkType] = useState<QuickLinkType>("phone");
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [editingCore, setEditingCore] = useState<CoreLinkKey | null>(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [address, setAddress] = useState(employee.address ?? "");
  const [birthday, setBirthday] = useState(employee.birthday ?? "");
  const [fullNameInput, setFullNameInput] = useState(() =>
    [employee.firstName, employee.lastName, employee.middleName]
      .filter(Boolean)
      .join(" "),
  );
  const fullName = [watch("firstName"), watch("lastName"), watch("middleName")]
    .filter(Boolean)
    .join(" ");
  const contactCardFormDefaults = {
    buttonLabel: normalizeContactCardButtonLabel(contactCardFields.buttonLabel),
    name: contactCardFields.name || fullName || employee.fullName,
    website: contactCardFields.website,
    jobTitle: watch("jobTitle") ?? "",
    birthday,
    additionalInfo: watch("additionalInfo") ?? "",
  };

  const setNameParts = (
    firstName: string,
    lastName: string,
    middleName: string,
  ) => {
    setValue("firstName", firstName, PROFILE_FIELD_OPTIONS);
    setValue("lastName", lastName, PROFILE_FIELD_OPTIONS);
    setValue("middleName", middleName, PROFILE_FIELD_OPTIONS);
    setFullNameInput(
      [firstName, lastName, middleName].filter(Boolean).join(" "),
    );
  };

  const handleFullNameChange = (value: string) => {
    const { firstName, lastName, middleName } = parseFullNameInput(value);
    setNameParts(firstName, lastName, middleName);
    setFullNameInput(value);
  };

  const handleAddSelect = (type: LinkType) => {
    if (type === "googlemaps") {
      setAddStep(null);
      setEditingCore("googleMapsUrl");
      return;
    }
    if (type === "contact-card") {
      setAddStep(null);
      setContactFormOpen(true);
      return;
    }
    if (type !== "website") setQuickLinkType(type);
    setAddStep(type);
  };

  const handleQuickLinkSave = (type: LinkType, results: QuickLinkResult[]) => {
    setContactInfos((prev) => [
      ...prev,
      ...results.map((result) => ({
        contactType: type,
        value: result.value,
        label: result.label,
      })),
    ]);
    setAddStep(null);
  };

  const handleWebsiteLinkSave = (result: WebsiteLinkResult) => {
    setSocialAccounts((prev) => [
      ...prev,
      {
        platformName: customWebsitePlatformName(result.headline),
        profileUrl: result.url,
        iconUrl: result.iconUrl,
      },
    ]);
    setAddStep(null);
  };

  const handleCancel = () => {
    photo.reset(employee.photoUrl);
    onCancel();
  };

  const editAvatar = useCallback(() => avatarFileInputRef.current?.click(), []);
  const editBackground = useCallback(
    () => backgroundFileInputRef.current?.click(),
    [],
  );
  const removeAvatar = useCallback(() => resetPhoto(), [resetPhoto]);
  const removeBackground = useCallback(
    () => resetBackground(),
    [resetBackground],
  );

  const saveContactCard = (
    {
      jobTitle,
      birthday: nextBirthday,
      additionalInfo,
      ...fields
    }: ContactCardFormValues,
    { firstName, lastName, middleName }: ContactCardFormNameParts,
  ) => {
    setNameParts(firstName, lastName, middleName);
    setValue("jobTitle", jobTitle, PROFILE_FIELD_OPTIONS);
    setValue("additionalInfo", additionalInfo, PROFILE_FIELD_OPTIONS);
    setBirthday(nextBirthday);
    setContactInfos((previous) => [
      ...previous.filter((info) => !isContactCardField(info)),
      ...buildContactCardEntries(fields, contactCardEnabled),
    ]);
    setContactFormOpen(false);
  };

  const deleteContactCard = () => {
    setContactInfos((previous) =>
      previous.filter((info) => !isContactCardField(info)),
    );
    setContactFormOpen(false);
  };

  const onValid = async (values: ProfileEditValues) => {
    try {
      const cleanedValues = buildProfileUpdate(values, {
        address,
        birthday,
        photoUrl: photo.src,
        cardBackgroundUrl: background.src,
        contactInfos,
        socialAccounts,
      });
      if (isOwnCard) {
        await updateProfile.mutateAsync(cleanedValues);
      } else {
        await updateEmployee.mutateAsync({
          id: employee.id,
          data: cleanedValues,
        });
      }
      onSaved();
    } catch {}
  };

  return {
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
  };
}
