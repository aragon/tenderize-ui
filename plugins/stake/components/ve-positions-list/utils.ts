import { PUB_EPOCH_DURATION, PUB_MAIN_TOKEN_NAME, PUB_SECONDARY_TOKEN_NAME } from "@/constants";
import { type VeTokenItem } from "./types";
import { Token } from "../../types/tokens";

export function epochsSince(timestamp: number, now: number): string {
  const diff = now - timestamp;
  if (diff < 0) return "-";

  const epochsRatio = diff / PUB_EPOCH_DURATION;
  return Math.ceil(epochsRatio).toString();
}

export function filterTokens(items: VeTokenItem[], filter: string) {
  if (!filter) return items;

  return items.filter((item) => {
    if (item.id.toString().includes(filter)) return true;
    else if (item.token === Token.MAIN_TOKEN && PUB_MAIN_TOKEN_NAME.includes(filter)) return true;
    else if (item.token === Token.SECONDARY_TOKEN && PUB_SECONDARY_TOKEN_NAME.includes(filter)) return true;

    return false;
  });
}
