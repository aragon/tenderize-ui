import {
  AlertInline,
  Avatar,
  Button,
  DataListContainer,
  DataListRoot,
  DialogContent,
  DialogHeader,
  DialogRoot,
  formatterUtils,
  IconType,
  NumberFormat,
} from "@aragon/ods";
import { useEffect, useState } from "react";
import { VotingListItem } from "./voting-item";
import { type GaugeItem } from "../gauges-list/types";
import { Token } from "../../types/tokens";
import { useVote } from "../../hooks/useVote";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";
import { type Address, formatUnits } from "viem";
import { useOwnedTokens } from "../../hooks/useOwnedTokens";
import { useGetVps } from "../../hooks/useGetVps";
import { useQueryClient } from "@tanstack/react-query";
import { PUB_MAIN_TOKEN_NAME, PUB_SECONDARY_TOKEN_NAME } from "@/constants";

type VotingDialogProps = {
  selectedGauges: GaugeItem[];
  voted: boolean;
  onRemove: (gauge: GaugeItem) => void;
};

type Vote = {
  address: Address;
  votes: number;
};

export const VotingDialog: React.FC<VotingDialogProps> = ({ selectedGauges, voted, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [mainVotes, setMainVotes] = useState<Vote[]>([]);
  const [secVotes, setSecVotes] = useState<Vote[]>([]);

  const { ownedTokens: mainOwnedTokensData } = useOwnedTokens(Token.MAIN_TOKEN);
  const { ownedTokens: secOwnedTokensData } = useOwnedTokens(Token.SECONDARY_TOKEN);

  const mainOwnedTokens = [...(mainOwnedTokensData ?? [])];
  const secOwnedTokens = [...(secOwnedTokensData ?? [])];

  const { data: mainOwnedTokensWithVp } = useGetVps(Token.MAIN_TOKEN, mainOwnedTokens);
  const { data: secOwnedTokensWithVp } = useGetVps(Token.SECONDARY_TOKEN, secOwnedTokens);

  const { vp: mainVp } = useGetAccountVp(Token.MAIN_TOKEN);
  const { vp: secVp } = useGetAccountVp(Token.SECONDARY_TOKEN);

  const formattedMainVp = formatterUtils.formatNumber(formatUnits(mainVp ?? 0n, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });
  const formattedSecVp = formatterUtils.formatNumber(formatUnits(secVp ?? 0n, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  const queryClient = useQueryClient();

  const { vote: secVote, isConfirming: secIsConfirming } = useVote(
    Token.SECONDARY_TOKEN,
    secOwnedTokensWithVp ?? [],
    secVotes.map((v) => ({ gauge: v.address, weight: BigInt(Math.floor(v.votes * 100)) })),
    async () => {
      await queryClient.invalidateQueries({ queryKey: ["readContracts", { functionName: "gaugeVotes" }] });
      await queryClient.invalidateQueries({ queryKey: ["readContracts", { functionName: "usedVotingPower" }] });
      // TODO: Remove this when we have a better way to invalidate the cache
      await queryClient.invalidateQueries();
      setOpen(false);
    }
  );
  const { vote: mainVote, isConfirming: mainIsConfirming } = useVote(
    Token.MAIN_TOKEN,
    mainOwnedTokensWithVp ?? [],
    mainVotes.map((v) => ({ gauge: v.address, weight: BigInt(Math.floor(v.votes * 100)) })),
    secVote
  );

  const totalMainVotes = mainVotes.reduce((acc, v) => acc + v.votes, 0);
  const totalSecVotes = secVotes.reduce((acc, v) => acc + v.votes, 0);
  const isValidVotes =
    (totalMainVotes === 100 || totalMainVotes === 0) &&
    (totalSecVotes === 0 || totalSecVotes === 100) &&
    (totalMainVotes === 100 || totalSecVotes === 100);

  useEffect(() => {
    if (!selectedGauges.length) {
      setOpen(false);
    }
  }, [selectedGauges.length]);

  const distributeEvenly = () => {
    const votes = selectedGauges.map((gauge, index) => {
      return {
        address: gauge.address,
        votes: (Math.floor(10000 / selectedGauges.length) + (index === 0 ? 10000 % selectedGauges.length : 0)) / 100,
      };
    });
    if (mainVp) setMainVotes(votes);
    if (secVp) setSecVotes(votes);
  };

  const resetValues = () => {
    setMainVotes([]);
    setSecVotes([]);
  };

  return (
    <>
      <Button
        size="lg"
        responsiveSize={{ md: "sm" }}
        isLoading={open}
        onClick={() => {
          setOpen(true);
        }}
        variant="primary"
        disabled={!selectedGauges.length}
      >
        {!voted ? "Vote now" : "Edit votes"}
      </Button>
      <DialogRoot open={open} onInteractOutside={() => setOpen(false)} containerClassName="!max-w-[1200px]">
        <DialogHeader
          title="Distribute your votes"
          onCloseClick={() => setOpen(false)}
          onBackClick={() => setOpen(false)}
        />
        <DialogContent className="mt-3 flex flex-col gap-y-4 md:gap-y-6">
          <div className="mb-4 flex w-full flex-row items-center gap-4 md:hidden">
            <Button
              className="flex w-1/2"
              size="md"
              responsiveSize={{ md: "sm" }}
              variant="secondary"
              onClick={distributeEvenly}
            >
              Distribute evenly
            </Button>
            <Button
              className="flex w-1/2"
              size="md"
              responsiveSize={{ md: "sm" }}
              variant="tertiary"
              onClick={resetValues}
            >
              Reset
            </Button>
          </div>
          <DataListRoot entityLabel="Projects" pageSize={selectedGauges.length} className="gap-y-6">
            <DataListContainer>
              {selectedGauges.map((gauge, pos) => (
                <VotingListItem
                  key={pos}
                  gauge={gauge}
                  mainVotes={mainVotes.find((v) => v.address === gauge.address)?.votes}
                  secVotes={secVotes.find((v) => v.address === gauge.address)?.votes}
                  totalMainVotes={mainVotes.reduce((acc, v) => acc + v.votes, 0)}
                  totalSecVotes={secVotes.reduce((acc, v) => acc + v.votes, 0)}
                  onRemove={() => {
                    setMainVotes(mainVotes.filter((v) => v.address !== gauge.address));
                    setSecVotes(secVotes.filter((v) => v.address !== gauge.address));
                    onRemove(gauge);
                  }}
                  onChange={(token, val) => {
                    const newValue = {
                      address: gauge.address,
                      votes: val,
                    };

                    if (token === Token.MAIN_TOKEN) {
                      setMainVotes((votes) => {
                        const oldVotes = votes.filter((v) => v.address !== gauge.address);
                        oldVotes.push(newValue);
                        return oldVotes;
                      });
                    } else {
                      setSecVotes((votes) => {
                        const oldVotes = votes.filter((v) => v.address !== gauge.address);
                        oldVotes.push(newValue);
                        return oldVotes;
                      });
                    }
                  }}
                />
              ))}
            </DataListContainer>
          </DataListRoot>
        </DialogContent>
        <div>
          <div className="flex flex-col gap-x-8 gap-y-2 px-8 py-4 md:flex-row md:items-center">
            <p className="title flex text-sm text-neutral-900">Your total votes</p>
            <div className="flex flex-row gap-2 md:flex-row md:gap-8">
              <div className="flex flex-row items-center gap-2 md:justify-center">
                <Avatar alt="Gauge icon" size="sm" responsiveSize={{ md: "sm" }} src="/main-token-icon.png" />
                <p>
                  {formattedMainVp} {PUB_MAIN_TOKEN_NAME}
                </p>
              </div>
              <div className="flex flex-row items-center gap-2 md:justify-center">
                <Avatar alt="Gauge icon" size="sm" responsiveSize={{ md: "sm" }} src="/secondary-token-icon.png" />
                <p>
                  {formattedSecVp} {PUB_SECONDARY_TOKEN_NAME}
                </p>
              </div>
            </div>

            <div className="hidden grow flex-row justify-end gap-4 md:flex">
              <Button size="md" responsiveSize={{ md: "sm" }} variant="secondary" onClick={distributeEvenly}>
                Distribute evenly
              </Button>
              <Button size="md" responsiveSize={{ md: "sm" }} variant="tertiary" onClick={resetValues}>
                Reset
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col-reverse gap-4 px-6 pb-6 md:flex-row">
            <div className="flex flex-row gap-4">
              <Button
                className="flex-grow"
                size="md"
                iconLeft={IconType.APP_PROPOSALS}
                isLoading={mainIsConfirming || secIsConfirming}
                disabled={!isValidVotes}
                onClick={() => {
                  mainVote();
                }}
              >
                Submit votes
              </Button>
              <Button
                className="hidden md:block"
                size="md"
                variant="tertiary"
                onClick={() => {
                  resetValues();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
            {!isValidVotes && (
              <AlertInline
                className="ml-2 justify-center"
                variant="critical"
                message="Percentages must add up to 100%"
              />
            )}
          </div>
        </div>
      </DialogRoot>
    </>
  );
};
