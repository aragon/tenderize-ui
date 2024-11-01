import { SimpleGaugeVotingAbi } from "@/artifacts/SimpleGaugeVoting.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "./useGetContract";

export function useGetGauges(token: Token) {
  const { data } = useGetContracts(token);

  const voterContract = data?.voterContract.result;

  const {
    data: gauges,
    isLoading,
    queryKey,
  } = useReadContract({
    address: voterContract,
    abi: SimpleGaugeVotingAbi,
    functionName: "getAllGauges",
    args: [],
    query: {
      enabled: !!voterContract,
    },
  });

  return {
    gauges,
    isLoading,
    queryKey,
  };
}
