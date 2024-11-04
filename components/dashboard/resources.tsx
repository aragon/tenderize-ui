import React from "react";
import { PUB_TELEGRAM_URL, PUB_GOV_FORUM_URL, PUB_DEV_PAGE_URL, PUB_APP_NAME_SHORT } from "@/constants";
import { Button, Card, Heading } from "@aragon/ods";

const resources = [
  {
    name: "Discord community",
    link: PUB_GOV_FORUM_URL,
    description: "Comment on proposals for partnerships, services or to apply for gauge listing.",
    cta: "Visit",
  },
  {
    name: "Telegram community",
    link: PUB_TELEGRAM_URL,
    description: `Join the ${PUB_APP_NAME_SHORT} community for direct access to the ${PUB_APP_NAME_SHORT} team, ecosystem builders and exclusive insights. Chat with other community members, grow your network and discover the latest opportunities on ${PUB_APP_NAME_SHORT}.`,
    cta: "Join",
  },
  {
    name: "Developers",
    link: PUB_DEV_PAGE_URL,
    description: `Build on ${PUB_APP_NAME_SHORT}: Push the limits with our community of hungry and talented builders.`,
    cta: "Start building",
  },
];

export const DashboardResources = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-6 pt-10 sm:grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] md:gap-10">
      {resources.map((resource) => (
        <Card key={resource.link} className="flex flex-col justify-between gap-y-6 bg-neutral-0 p-6 shadow-neutral-md">
          <Heading size="h2" className="text-neutral-900">
            {resource.name}
          </Heading>
          <div className="flex grow flex-col justify-start">
            <p className="text-neutral-700 ">{resource.description}</p>
          </div>
          <span className="flex">
            <Button href={resource.link} variant="secondary" rel="noopener noreferrer" target="_blank">
              {resource.cta}
            </Button>
          </span>
        </Card>
      ))}
    </div>
  );
};
