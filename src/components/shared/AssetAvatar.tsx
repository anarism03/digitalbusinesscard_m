import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useAssetSrc } from "../../hooks/useAssetSrc";
import type { AssetAvatarProps } from "../../types/components/shared";

export default function AssetAvatar({
  src,
  name,
  icon,
  children,
  imageStyle,
  ...avatarProps
}: AssetAvatarProps) {
  const currentSrc = useAssetSrc(src);

  const fallbackIcon = icon ?? <UserOutlined />;
  const fallbackText = children ?? name?.trim()?.[0]?.toUpperCase();

  return (
    <Avatar
      {...avatarProps}
      src={
        currentSrc ? (
          <img
            src={currentSrc}
            alt={name || ""}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              ...imageStyle,
            }}
          />
        ) : undefined
      }
      icon={!currentSrc && !fallbackText ? fallbackIcon : undefined}
    >
      {!currentSrc ? fallbackText : undefined}
    </Avatar>
  );
}
