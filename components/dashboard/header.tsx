import { PUB_APP_NAME_SHORT } from "@/constants";
import React from "react";

export const DashboardHeader = () => {
  return (
    <header className="relative flex w-full justify-center">
      <div className="flex w-full max-w-screen-xl flex-col gap-y-8 pb-8 pt-8 md:gap-y-12 md:pt-2">
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-2 md:w-4/5">
            <h1 className="text-4xl leading-tight text-neutral-800 md:text-5xl">
              <span className="text-4xl text-neutral-900">
                Welcome to the <br />
              </span>{" "}
              {PUB_APP_NAME_SHORT} Community
            </h1>
            <p className="text-xl leading-normal text-neutral-600">
              The {PUB_APP_NAME_SHORT} Governance Hub is the home for the {PUB_APP_NAME_SHORT} community to participate
              in {PUB_APP_NAME_SHORT}&apos;s evolving Governance. {PUB_APP_NAME_SHORT} builds infrastructure, assets,
              and applications with a mission to bring decentralized finance to billions of users globally. Welcome to{" "}
              {PUB_APP_NAME_SHORT}, governed on Aragon.
            </p>
          </div>
        </div>
        {/* <div className="flex flex-row gap-x-20 gap-y-6">
          <div className="flex flex-col">
            <div className="title flex items-baseline gap-x-1">
              <span className="text-3xl text-neutral-900 md:text-4xl">$___M</span>
            </div>
            <span className="text-xl text-neutral-700">TVL</span>
          </div>
          <div className="flex flex-col">
            <div className="title flex items-baseline gap-x-1">
              <span className="text-3xl text-neutral-900 md:text-4xl">___K+</span>
            </div>
            <span className="text-xl text-neutral-700">Token holders</span>
          </div>
        </div> */}
      </div>
    </header>
  );
};
