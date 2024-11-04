import { Card, IconType, Link, TabsContent, TabsList, TabsRoot, TabsTrigger } from "@aragon/ods";
import React from "react";
import { StakeToken } from "./tab";
import { Token } from "../../types/tokens";
import { PUB_MAIN_TOKEN_NAME, PUB_SECONDARY_TOKEN_NAME, PUB_STAKING_LEARN_MORE_URL } from "@/constants";

interface IStakeProps {
  onStake?: () => void;
}

export const Stake: React.FC<IStakeProps> = ({ onStake }) => {
  return (
    <Card className="w-full p-8">
      <TabsRoot defaultValue="main">
        <TabsList>
          <TabsTrigger
            className="main-token-icon w-1/2 justify-center px-1 text-xl md:w-auto"
            label={PUB_MAIN_TOKEN_NAME}
            value="main"
          />
          {/* <TabsTrigger
            className="secondary-token-icon w-1/2 justify-center px-1 text-xl md:w-auto"
            label={PUB_SECONDARY_TOKEN_NAME}
            value="secondary"
          /> */}
        </TabsList>
        <TabsContent value="main" className="pt-4">
          <StakeToken token={Token.MAIN_TOKEN} onStake={onStake} />
        </TabsContent>
        {/* <TabsContent value="secondary" className="pt-4">
          <StakeToken token={Token.SECONDARY_TOKEN} onStake={onStake} />
        </TabsContent> */}
      </TabsRoot>
      <div className="mt-5 text-center">
        <span>
          Please note that you will need to wait for the warmup and cooldown periods to complete in order to unstake.
        </span>
        <Link href={PUB_STAKING_LEARN_MORE_URL} iconRight={IconType.LINK_EXTERNAL} className="pl-1">
          Learn more
        </Link>
      </div>
    </Card>
  );
};
