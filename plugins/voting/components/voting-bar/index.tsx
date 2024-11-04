import { Avatar, DataListItem, formatterUtils, NumberFormat, Tag } from "@aragon/ods";

import { VotingDialog } from "../voting-dialog";
import { type GaugeItem } from "../gauges-list/types";
import { Token } from "../../types/tokens";
import { useOwnedTokens } from "../../hooks/useOwnedTokens";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";
import { formatUnits } from "viem";
import { useGetUsedVp } from "../../hooks/useGetUsedVp";
import { useAccount } from "wagmi";
import { PUB_MAIN_TOKEN_NAME, PUB_SECONDARY_TOKEN_NAME } from "@/constants";

type VotingBarProps = {
  selectedGauges: GaugeItem[];
  onRemove: (gauge: GaugeItem) => void;
};

export const VotingBar: React.FC<VotingBarProps> = ({ selectedGauges, onRemove }) => {
  const { isConnected } = useAccount();

  const { ownedTokens: mainOwnedTokensData } = useOwnedTokens(Token.MAIN_TOKEN);
  const { ownedTokens: secOwnedTokensData } = useOwnedTokens(Token.SECONDARY_TOKEN);

  const mainOwnedTokens = [...(mainOwnedTokensData ?? [])];
  const secOwnedTokens = [...(secOwnedTokensData ?? [])];

  const { data: usedMainVp } = useGetUsedVp(Token.MAIN_TOKEN, mainOwnedTokens);
  const { data: usedSecVp } = useGetUsedVp(Token.SECONDARY_TOKEN, secOwnedTokens);

  const { vp: mainVpBn } = useGetAccountVp(Token.MAIN_TOKEN);
  const { vp: secVpBn } = useGetAccountVp(Token.SECONDARY_TOKEN);

  if (!isConnected) {
    return null;
  }

  const hasVp = !(mainVpBn === 0n && secVpBn === 0n);

  const mainVp = formatUnits(mainVpBn ?? 0n, 18);
  const secVp = formatUnits(secVpBn ?? 0n, 18);

  const formattedMainVp = formatterUtils.formatNumber(mainVp, {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });
  const formattedSecVp = formatterUtils.formatNumber(secVp, {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  const mainPercentage = Number(mainVp) ? Number(formatUnits(usedMainVp ?? 0n, 18)) / Number(mainVp) : 0;
  const secPercentage = Number(secVp) ? Number(formatUnits(usedSecVp ?? 0n, 18)) / Number(secVp) : 0;

  const formattedMainPercentage = formatterUtils.formatNumber(mainPercentage, {
    format: NumberFormat.PERCENTAGE_SHORT,
  });
  const formattedSecPercentage = formatterUtils.formatNumber(secPercentage, {
    format: NumberFormat.PERCENTAGE_SHORT,
  });

  const voted = (usedMainVp ?? 0n) > 0n || (usedSecVp ?? 0n) > 0n;

  return (
    <div className="sticky -bottom-2 -mb-12 md:-mx-8">
      <DataListItem>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8 md:py-2">
          <p className="title flex text-sm text-neutral-900">Your total voting power</p>
          <div className="flex flex-grow flex-row gap-8">
            <div className="flex flex-row items-center gap-2">
              <Avatar alt="Gauge icon" size="sm" responsiveSize={{ md: "sm" }} src="/main-token-icon.png" />
              <p className="text-md md:text-base">
                {formattedMainVp} {PUB_MAIN_TOKEN_NAME}
              </p>
              {mainPercentage > 0 && <p className="hidden sm:block">({formattedMainPercentage} used)</p>}
            </div>
            <div className="flex flex-row items-center gap-2">
              <Avatar alt="Gauge icon" size="sm" responsiveSize={{ md: "sm" }} src="/secondary-token-icon.png" />
              <p className="text-md md:text-base">
                {formattedSecVp} {PUB_SECONDARY_TOKEN_NAME}
              </p>
              {secPercentage > 0 && <p className="hidden sm:block">({formattedSecPercentage} used)</p>}
            </div>
          </div>

          <div className="absolute right-3 top-4 md:relative md:right-0 md:top-0 md:flex md:flex-row md:gap-2">
            {hasVp &&
              (voted || !!selectedGauges.length ? (
                <Tag label={`${selectedGauges.length} selected`} />
              ) : (
                <Tag label="Select gauges" />
              ))}
          </div>
          <VotingDialog voted={voted} selectedGauges={selectedGauges} onRemove={(gauge) => onRemove(gauge)} />
        </div>
      </DataListItem>
    </div>
  );
};
