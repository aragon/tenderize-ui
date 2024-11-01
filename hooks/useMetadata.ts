import { fetchIpfsAsJson } from "@/utils/ipfs";
import { type JsonValue } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useMetadata<T = JsonValue>(ipfsUri?: string) {
  const { data, isLoading, isSuccess, error } = useQuery<T, Error>({
    queryKey: ["ipfs", ipfsUri || ""],
    queryFn: async () => {
      if (!ipfsUri) return null;

      try {
        return fetchIpfsAsJson(ipfsUri);
      } catch (error) {
        console.error("Failed to fetch IPFS metadata", error);
        throw error;
      }
    },
    retry: true,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retryOnMount: true,
    staleTime: Infinity,
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
}

export const useIpfsJsonData = useMetadata;
