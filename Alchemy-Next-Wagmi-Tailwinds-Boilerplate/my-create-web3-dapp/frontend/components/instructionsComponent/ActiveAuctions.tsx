import { useEffect, useState } from "react";
import {
    useAccount,
    useBalance,
    useContractRead,
    useContractWrite,
    useNetwork,
  } from "wagmi";
  
import { contractABI } from "./contractABI";
import {factoryContractABI} from "./factoryContractAbi";

function ActiveAuctions() {
  const { data, isLoading, isError } = useContractRead({
    address: "0x852e6601868c0F1d7203Eb2faE890172b6401882", 
    abi: factoryContractABI,
    functionName: "auctions",
  });

  const [activeAuctions, setActiveAuctions] = useState<string[]>([]); // Assuming the auction addresses are of type string
  const [currentBids, setCurrentBids] = useState<number[]>([]);

  useEffect(() => {
    if (!data) return;

    // Fetch auction statuses for each auction address
    const fetchAuctionStatuses = async () => {
      const auctionStatuses = await Promise.all(
        data.map(async (auctionAddress: string) => {
          const statusData = await useContractRead({
            address: `0x${auctionAddress}`, // Prepend "0x" to the auction address
            abi: contractABI,
            functionName: "getStatus",
          });
          return statusData.data as unknown as number; // Type assertion to number
        })
      );

      // Filter auctions based on their status
      const activeAuctionAddresses = data.filter((_, index) => {
        return auctionStatuses[index] === 1; // 1 corresponds to STARTED status
      });

      setActiveAuctions(activeAuctionAddresses);
    };

    // Fetch current bids for each active auction
    const fetchCurrentBids = async () => {
      const bids = await Promise.all(
        activeAuctions.map(async (auctionAddress: string) => {
          const currentBidData = await useContractRead({
            address: `0x${auctionAddress}`,
            abi: contractABI,
            functionName: "getCurrentBid",
          });
          return currentBidData.data as unknown as number;
        })
      );

      setCurrentBids(bids);
    };

    fetchAuctionStatuses();
    fetchCurrentBids();
  }, [data, activeAuctions]);

  if (isLoading) {
    return <div className="text-lg font-bold font-vt323 mb-4">Loading active auctions...</div>;
  }

  if (isError) {
    return <div className="text-lg font-bold font-vt323 mb-4">Error fetching active auctions</div>;
  }

  if (activeAuctions.length === 0) {
    return <div className="text-lg font-bold font-vt323 mb-4">No active auctions at the moment.</div>;
  }

  return (
    <div>
      <h2>Active Auctions</h2>
      {activeAuctions.map((auctionAddress, index) => (
        <div key={index}>
          <p 
            className="text-lg font-bold font-vt323 italic bg-black rounded-lg text-white p-2 mb-2"
          >
            {auctionAddress}
          </p>
          <p className="text-lg font-bold font-vt323">
            Current Bid: {currentBids[index]} ETH
          </p>
          <button className="text-lg font-bold font-vt323 italic bg-black rounded-lg text-white p-2 mb-4">
            Bid Auction
          </button>
        </div>
      ))}
    </div>
  );
}

export default ActiveAuctions;
