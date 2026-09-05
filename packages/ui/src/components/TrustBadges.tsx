import React from "react";
import { Badge } from "./Badge";

export interface TrustBadgesProps {
  nationalId?: boolean;
  degreeVerified?: boolean;
  gold?: boolean;
  elite?: boolean;
  compact?: boolean;
}

export function TrustBadges({
  nationalId,
  degreeVerified,
  gold,
  elite,
  compact,
}: TrustBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {nationalId && (
        <Badge variant="verified" size={compact ? "sm" : "md"} icon="🛡️">
          {compact ? "ID" : "National ID Verified"}
        </Badge>
      )}
      {degreeVerified && (
        <Badge variant="info" size={compact ? "sm" : "md"} icon="🎓">
          {compact ? "Degree" : "Degree Verified by Board"}
        </Badge>
      )}
      {gold && (
        <Badge variant="gold" size={compact ? "sm" : "md"} icon="🥇">
          {compact ? "Gold" : "Gold Top 1%"}
        </Badge>
      )}
      {elite && (
        <Badge variant="elite" size={compact ? "sm" : "md"} icon="⭐">
          {compact ? "Elite" : "Elite Tutor"}
        </Badge>
      )}
    </div>
  );
}

export default TrustBadges;