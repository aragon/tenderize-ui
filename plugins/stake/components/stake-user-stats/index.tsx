import React from "react";
import { Token } from "../../types/tokens";
import { NumberFormat, formatterUtils } from "@aragon/ods";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";
import { formatUnits } from "viem";
import { PUB_MAIN_TOKEN_CONTRACT, PUB_SECONDARY_TOKEN_NAME } from "@/constants";

export const StakeUserStats: React.FC = () => {
  const { vp: mainVp } = useGetAccountVp(Token.MAIN_TOKEN);
  const { vp: secVp } = useGetAccountVp(Token.SECONDARY_TOKEN);

  const balanceMainToken = formatterUtils.formatNumber(formatUnits(mainVp ?? 0n, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  const balanceSecondaryToken = formatterUtils.formatNumber(formatUnits(secVp ?? 0n, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  return (
    <aside className="flex w-full flex-col gap-y-4 md:mt-7 md:gap-y-6">
      <dl className="divide-y divide-neutral-100">
        <div className="flex flex-col items-baseline gap-y-2 py-3 lg:gap-x-6 lg:py-4">
          <dt className="line-clamp-1 shrink-0 text-xl leading-tight text-neutral-800 lg:line-clamp-6">
            <h2>
              <span className="text-neutral-900">Your active</span> voting power
            </h2>
          </dt>
        </div>

        <div className="grid grid-cols-2 gap-y-3 py-3">
          <p>{PUB_MAIN_TOKEN_CONTRACT}</p>
          <p className="text-neutral-900">{balanceMainToken}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 py-3">
          <p>{PUB_SECONDARY_TOKEN_NAME}</p>
          <p className="text-neutral-900">{balanceSecondaryToken}</p>
        </div>
      </dl>
    </aside>
  );
};
