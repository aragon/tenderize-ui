import { MainSection } from "@/components/layout/main-section";
import { PUB_SWAP_TOKENS_URL, PUB_MAIN_TOKEN_NAME, PUB_STAKING_LEARN_MORE_URL, PUB_WARMUP_DAYS } from "@/constants";
import { SectionHeader } from "./components/section-header";
import { Stake } from "./components/stake";
import { StakeUserStats } from "./components/stake-user-stats";
import { StakePositions } from "./components/ve-positions-list";
import React from "react";
import { Button, IconType } from "@aragon/ods";
import GetMoreTokens from "./components/get-tokens-links";

export default function PluginPage() {
  return (
    <div className="bg-gradient-to-b from-neutral-0 to-transparent">
      <MainSection>
        <SectionHeader title="Stake" learnMoreUrl={PUB_STAKING_LEARN_MORE_URL}>
          Stake and vote with your {PUB_MAIN_TOKEN_NAME || "tokens"}. Increase your voting power by staking more tokens.
          The longer you stake, the higher your voting power multiplier will be. New stakes will be subject to a minimum
          {PUB_WARMUP_DAYS} day warmup before they are eligible to vote. Warm ups can be up to 6 days if staking well
          before an upcoming epoch changeover.
        </SectionHeader>
        <div className="mt-6 grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <div className="mb-6">
            <Stake />
          </div>
          <div className="mx-16 flex flex-col gap-y-4">
            <StakeUserStats />
            <Button
              className="mt-6"
              href={PUB_SWAP_TOKENS_URL}
              target="_blank"
              variant="secondary"
              size="lg"
              responsiveSize={{ md: "lg" }}
              iconRight={IconType.LINK_EXTERNAL}
            >
              Swap tokens
            </Button>
            <GetMoreTokens />
          </div>
        </div>
        <div className="mt-12 md:mt-6">
          <StakePositions />
        </div>
      </MainSection>
    </div>
  );
}
