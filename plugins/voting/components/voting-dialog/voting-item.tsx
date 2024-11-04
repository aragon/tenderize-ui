import { Avatar, Button, DataListItem, IconType, type IInputContainerAlert, InputNumber, Tooltip } from "@aragon/ods";
import React, { useEffect } from "react";
import { type GaugeItem } from "../gauges-list/types";
import { shortenAddress } from "@/utils/address";
import { Token } from "../../types/tokens";
import { useGetVotes } from "../../hooks/useGetVotes";
import { useOwnedTokens } from "../../hooks/useOwnedTokens";
import { formatUnits } from "viem";
import { useGetUsedVp } from "../../hooks/useGetUsedVp";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";
import { PUB_MAIN_TOKEN_NAME, PUB_SECONDARY_TOKEN_NAME } from "@/constants";

type VotingListItemProps = {
  gauge: GaugeItem;
  mainVotes?: number;
  secVotes?: number;
  totalMainVotes: number;
  totalSecVotes: number;
  onChange: (token: Token, votes: number) => void;
  onRemove: () => void;
};
export const VotingListItem: React.FC<VotingListItemProps> = ({
  gauge,
  mainVotes,
  secVotes,
  totalMainVotes,
  totalSecVotes,
  onChange,
  onRemove,
}) => {
  const { ownedTokens: mainOwnedTokensData } = useOwnedTokens(Token.MAIN_TOKEN);
  const { ownedTokens: secOwnedTokensData } = useOwnedTokens(Token.SECONDARY_TOKEN);

  const mainOwnedTokens = [...(mainOwnedTokensData ?? [])];
  const secOwnedTokens = [...(secOwnedTokensData ?? [])];

  const { data: userMainVotesData } = useGetVotes(Token.MAIN_TOKEN, [...mainOwnedTokens], gauge.address);
  const { data: userSecVotesData } = useGetVotes(Token.SECONDARY_TOKEN, [...secOwnedTokens], gauge.address);

  const { data: usedMainVp } = useGetUsedVp(Token.MAIN_TOKEN, mainOwnedTokens);
  const { data: usedSecVp } = useGetUsedVp(Token.SECONDARY_TOKEN, secOwnedTokens);

  const { vp: mainVp } = useGetAccountVp(Token.MAIN_TOKEN);
  const { vp: secVp } = useGetAccountVp(Token.SECONDARY_TOKEN);

  const mainPerc = usedMainVp
    ? Math.round((Number(formatUnits(userMainVotesData ?? 0n, 18)) / Number(formatUnits(usedMainVp, 18))) * 100)
    : 0;

  const secPerc = usedSecVp
    ? Math.round((Number(formatUnits(userSecVotesData ?? 0n, 18)) / Number(formatUnits(usedSecVp, 18))) * 100)
    : 0;

  useEffect(() => {
    if (mainVotes === undefined && mainPerc) {
      onChange(Token.MAIN_TOKEN, mainPerc);
    }
  }, [mainVotes, mainPerc, onChange]);

  useEffect(() => {
    if (secVotes === undefined && secPerc) {
      onChange(Token.SECONDARY_TOKEN, secPerc);
    }
  }, [secVotes, secPerc, onChange]);

  const getMainAlert = () => {
    return totalMainVotes !== 100 && totalMainVotes !== 0 ? ("critical" as IInputContainerAlert["variant"]) : undefined;
  };

  const getSecAlert = () => {
    return totalSecVotes !== 100 && totalSecVotes !== 0 ? ("critical" as IInputContainerAlert["variant"]) : undefined;
  };

  return (
    <DataListItem className="flex flex-col items-center gap-4 md:flex-row">
      <div className="flex w-full flex-auto items-center gap-x-3 md:w-1/4">
        <Avatar
          alt="Gauge icon"
          size="lg"
          src={gauge.metadata?.logo}
          fallback={
            <span className="flex size-full items-center justify-center bg-primary-400 text-neutral-0">
              {gauge.metadata?.name.slice(0, 2)}
            </span>
          }
        />
        <div className="flex flex-col">
          <p className="title text-neutral-900">{gauge.metadata?.name}</p>
          <p className="text-neutral-600">{shortenAddress(gauge.address)}</p>
        </div>
        <div className="flex w-full flex-row-reverse md:hidden">
          <Button
            variant="tertiary"
            size="sm"
            iconLeft={IconType.CLOSE}
            onClick={() => {
              onChange(Token.MAIN_TOKEN, 0);
              onChange(Token.SECONDARY_TOKEN, 0);
              onRemove();
            }}
          />
        </div>
      </div>
      <div className="w-full flex-auto md:w-1/4">
        <div className="mx-4 flex flex-row items-center gap-2">
          <Avatar alt="Main token icon" size="sm" src="/main-token-icon.png" />
          <p className="w-1/5">{PUB_MAIN_TOKEN_NAME}</p>
          <InputNumber
            value={mainVotes ?? mainPerc}
            step={1}
            variant={getMainAlert()}
            disabled={mainVp === 0n}
            suffix="%"
            min={0}
            max={100}
            onChange={(val) => {
              if (val === undefined) return;
              onChange(Token.MAIN_TOKEN, Number(val));
            }}
          />
        </div>
      </div>
      <div className="w-full flex-auto md:w-1/4">
        <div className="mx-4 flex flex-row items-center gap-2">
          <Avatar alt="Secondary token icon" size="sm" src="/secondary-token-icon.png" />
          <p className="w-1/5">{PUB_SECONDARY_TOKEN_NAME}</p>
          <InputNumber
            value={secVotes ?? secPerc}
            step={1}
            variant={getSecAlert()}
            disabled={secVp === 0n}
            suffix="%"
            min={0}
            max={100}
            onChange={(val) => {
              if (val === undefined) return;
              onChange(Token.SECONDARY_TOKEN, Number(val));
            }}
          />
        </div>
      </div>
      <div className="w-1/8 hidden flex-row-reverse md:block">
        <Button
          variant="tertiary"
          size="sm"
          iconLeft={IconType.REMOVE}
          onClick={() => {
            onChange(Token.MAIN_TOKEN, 0);
            onChange(Token.SECONDARY_TOKEN, 0);
            onRemove();
          }}
        />
      </div>
    </DataListItem>
  );
};
