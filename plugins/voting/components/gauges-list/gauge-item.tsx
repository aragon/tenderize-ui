import { Avatar, Button, DataListItem, formatterUtils, IconType, NumberFormat } from "@aragon/ods";
import { type GaugeItem } from "./types";
import { Fragment, useEffect, useState } from "react";
import { shortenAddress } from "@/utils/address";
import { useGetVotes } from "../../hooks/useGetVotes";
import { useOwnedTokens } from "@/plugins/stake/hooks/useOwnedTokens";
import { useGetGaugeVotes } from "../../hooks/useGetGaugeVotes";
import { formatUnits } from "viem";
import { GaugeDetailsDialog } from "./gauge-details-dialog";
import { Token } from "../../types/tokens";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";
import { PUB_MAIN_TOKEN_NAME, PUB_SECONDARY_TOKEN_NAME } from "@/constants";

type GaugeItemProps = {
  props: GaugeItem;
  totalVotes: bigint;
  selected: boolean;
  onSelect: (selected: boolean) => void;
};

export const GaugeListItem: React.FC<GaugeItemProps> = ({ props, selected, totalVotes: totalVotesBn, onSelect }) => {
  const metadata = props.metadata;
  const [openDialog, setOpenDialog] = useState(false);

  const { ownedTokens: mainOwnedTokens } = useOwnedTokens(Token.MAIN_TOKEN);
  const mainTokenIds = mainOwnedTokens ?? [];

  const { ownedTokens: secOwnedTokens } = useOwnedTokens(Token.SECONDARY_TOKEN);
  const secTokenIds = secOwnedTokens ?? [];

  const { data: userMainVotesData } = useGetVotes(Token.MAIN_TOKEN, [...mainTokenIds], props.address);
  const { data: userSecVotesData } = useGetVotes(Token.SECONDARY_TOKEN, [...secTokenIds], props.address);
  const { data: mainGaugeVotesData } = useGetGaugeVotes(Token.MAIN_TOKEN, props.address);
  const { data: secGaugeVotesData } = useGetGaugeVotes(Token.SECONDARY_TOKEN, props.address);

  const { vp: mainVp } = useGetAccountVp(Token.MAIN_TOKEN);
  const { vp: secVp } = useGetAccountVp(Token.SECONDARY_TOKEN);

  const hasBalance = !((!mainVp || mainVp === 0n) && (secVp === 0n || !secVp));

  const userMainVotesBn = BigInt(userMainVotesData ?? 0n);
  const userSecVotesBn = BigInt(userSecVotesData ?? 0n);
  const mainGaugeTotalVotesBn = BigInt(mainGaugeVotesData ?? 0n);
  const secGaugeTotalVotesBn = BigInt(secGaugeVotesData ?? 0n);

  const gaugeTotalVotesBn = mainGaugeTotalVotesBn + secGaugeTotalVotesBn;

  const mainUserVotes = formatterUtils.formatNumber(formatUnits(userMainVotesBn, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });
  const secUserVotes = formatterUtils.formatNumber(formatUnits(userSecVotesBn, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });
  const gaugeTotalVotes = formatterUtils.formatNumber(formatUnits(gaugeTotalVotesBn, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  const percentage = (Number(formatUnits(gaugeTotalVotesBn, 18)) / Number(formatUnits(totalVotesBn, 18))) * 100;
  const formattedPercentage = formatterUtils.formatNumber(percentage ? percentage : 0, {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  useEffect(() => {
    if (userMainVotesBn > 0n || userSecVotesBn > 0n) {
      onSelect(true);
    }
  }, [userMainVotesBn, userSecVotesBn]);

  return (
    <>
      <Fragment>
        <div>
          <GaugeDetailsDialog
            selectedGauge={props}
            openDialog={openDialog}
            onClose={() => {
              setOpenDialog(false);
            }}
          />
          <DataListItem
            key={metadata?.name}
            className="mt-2 flex flex-col gap-x-4 border border-neutral-100 p-4 md:flex-row md:items-center"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <div className="flex w-full flex-row items-center gap-x-3 md:w-1/6">
              <Avatar
                alt="Gauge icon"
                size="lg"
                src={metadata?.logo}
                fallback={
                  <span className="flex size-full items-center justify-center bg-primary-400 text-neutral-0">
                    {metadata?.name.slice(0, 2).toUpperCase()}
                  </span>
                }
              />
              <div className="flex flex-col">
                <p className="title text-neutral-900">{metadata?.name}</p>
                <p className="text-neutral-600">{shortenAddress(props.address)}</p>
              </div>
            </div>
            <div className="flex w-full flex-row md:w-3/6">
              <div className="my-2 flex w-1/2 flex-col md:my-0 md:text-right">
                <p className="mb-1 mt-3 text-neutral-900 md:hidden">Total votes</p>
                <p>
                  {gaugeTotalVotes} <span className="title text-xs text-neutral-600">votes</span>
                </p>
                <p>
                  {formattedPercentage}% <span className="title text-xs text-neutral-600">of total</span>
                </p>
              </div>
              <div className="my-2 flex w-1/2 flex-col justify-start md:my-0 md:justify-center md:text-right">
                <p className="mb-1 mt-3 text-neutral-900 md:hidden">Your votes</p>
                {userMainVotesBn || userSecVotesBn ? (
                  <>
                    <p>
                      {mainUserVotes} <span className="title text-xs text-neutral-600">{PUB_MAIN_TOKEN_NAME}</span>
                    </p>
                    <p>
                      {secUserVotes} <span className="title text-xs text-neutral-600">{PUB_SECONDARY_TOKEN_NAME}</span>
                    </p>
                  </>
                ) : (
                  <p className="title text-neutral-700">None</p>
                )}
              </div>
            </div>
            <div className="w-full flex-auto md:w-1/6">
              <div className="flex flex-row-reverse">
                <Button
                  size="sm"
                  disabled={!hasBalance}
                  variant={selected ? "primary" : "tertiary"}
                  iconLeft={selected ? IconType.CHECKMARK : undefined}
                  className="btn btn-primary w-full md:w-1/2"
                  onClick={(ev: any) => {
                    ev.stopPropagation();
                    onSelect(!selected);
                  }}
                >
                  {selected ? "Selected" : hasBalance ? "Select to vote" : "Stake to vote"}
                </Button>
              </div>
            </div>
          </DataListItem>
        </div>
        <div className="hidden">
          <DataListItem key={metadata?.name} className="my-2 border border-neutral-100 px-4 py-2">
            <dl className="flex flex-col divide-y divide-neutral-100">
              <div className="flex justify-between py-2">
                <div className="flex items-center gap-x-4">
                  <Avatar
                    alt="Gauge icon"
                    size="lg"
                    src={metadata?.logo}
                    fallback={
                      <span className="flex size-full items-center justify-center bg-primary-400 text-neutral-0">
                        {metadata?.name.slice(0, 2).toUpperCase()}
                      </span>
                    }
                  />
                  {metadata?.name}
                </div>
                <div>{gaugeTotalVotes}</div>
              </div>
            </dl>
          </DataListItem>
        </div>
      </Fragment>
    </>
  );
};
