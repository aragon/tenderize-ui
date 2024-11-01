import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useReadContracts } from "wagmi";
import { PUB_MAIN_ESCROW_CONTRACT, PUB_MAIN_TOKEN_CONTRACT, PUB_SECONDARY_ESCROW_CONTRACT, PUB_SECONDARY_TOKEN_CONTRACT } from "@/constants";
import { Token } from "../types/tokens";

export function getEscrowContract(token: Token) {
  return token === Token.MODE ? PUB_MAIN_ESCROW_CONTRACT : PUB_SECONDARY_ESCROW_CONTRACT;
}

export function getTokenContract(token: Token) {
  return token === Token.MODE ? PUB_MAIN_TOKEN_CONTRACT : PUB_SECONDARY_TOKEN_CONTRACT;
}

export function useGetContracts(token: Token) {
  const escrowContract = getEscrowContract(token);

  const votingEscrowContract = {
    address: escrowContract,
    abi: VotingEscrowAbi,
  } as const;

  const res = useReadContracts({
    contracts: [
      {
        ...votingEscrowContract,
        functionName: "token",
      },
      {
        ...votingEscrowContract,
        functionName: "voter",
      },
      {
        ...votingEscrowContract,
        functionName: "curve",
      },
      {
        ...votingEscrowContract,
        functionName: "queue",
      },
      {
        ...votingEscrowContract,
        functionName: "clock",
      },
      {
        ...votingEscrowContract,
        functionName: "lockNFT",
      },
    ],
    query: {
      select(data) {
        return {
          tokenContract: data[0],
          voterContract: data[1],
          curveContract: data[2],
          queueContract: data[3],
          clockContract: data[4],
          lockNFTContract: data[5],
        };
      },
      gcTime: Infinity,
      staleTime: 60 * 60 * 1000,
    },
  });

  return res;
}
