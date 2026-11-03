import { RightOutlined } from "@ant-design/icons";
import { useIconSrc } from "../../../hooks/useAssetSrc";
import {
  getIconTileStyle,
  styles,
} from "../../../styles/business-card/PublicLinkTiles.styles";
import type { PublicLinkProps } from "../../../types";
import type {
  LinkIconProps,
  LinkTriggerProps,
} from "../../../types/components/business-card";
import { publicLinkHref } from "../../../utils/url";
import BrandIcon from "../../shared/BrandIcon";

function LinkIcon({ row }: LinkIconProps) {
  const src = useIconSrc(row.iconSrc);

  if (src) {
    return <BrandIcon src={src} style={styles.iconImage} />;
  }
  return (
    <span style={{ ...styles.iconFallback, color: "var(--color-brand)" }}>
      {row.icon}
    </span>
  );
}

function LinkTrigger({
  group,
  onOpen,
  style,
  labelled = false,
  children,
}: LinkTriggerProps) {
  const row = group.representative;

  if (group.rows.length > 1) {
    return (
      <button
        type="button"
        aria-label={labelled ? `${row.label} seçimlərini aç` : undefined}
        className="public-card-link"
        style={{ ...style, ...styles.groupTrigger }}
        onClick={() => onOpen(group)}
      >
        {children}
      </button>
    );
  }

  const href = publicLinkHref(row.href);
  const isExternal = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      aria-label={labelled ? row.label : undefined}
      className="public-card-link"
      style={style}
    >
      {children}
    </a>
  );
}

export function IconTile({ group, onOpen }: PublicLinkProps) {
  const row = group.representative;
  return (
    <LinkTrigger
      group={group}
      onOpen={onOpen}
      style={getIconTileStyle(row.tint)}
      labelled
    >
      <LinkIcon row={row} />
    </LinkTrigger>
  );
}

export function LinkCard({ group, onOpen }: PublicLinkProps) {
  const row = group.representative;
  return (
    <LinkTrigger group={group} onOpen={onOpen} style={styles.linkCard}>
      <span className="public-card-link-icon" style={styles.linkCardIcon}>
        <LinkIcon row={row} />
      </span>
      <span style={styles.linkCardText}>
        <span style={styles.linkCardLabel}>{row.label}</span>
        {row.category === "other" && (
          <span style={styles.linkCardValue} title={row.value}>
            {row.value.replace(/^https?:\/\//i, "")}
          </span>
        )}
      </span>
      <RightOutlined
        className="public-card-link-arrow"
        style={styles.linkCardArrow}
      />
    </LinkTrigger>
  );
}

export function ContactTile({ group, onOpen }: PublicLinkProps) {
  return (
    <LinkTrigger
      group={group}
      onOpen={onOpen}
      style={styles.contactTile}
      labelled
    >
      <span className="public-card-link-icon" style={styles.contactTileIcon}>
        <LinkIcon row={group.representative} />
      </span>
    </LinkTrigger>
  );
}
