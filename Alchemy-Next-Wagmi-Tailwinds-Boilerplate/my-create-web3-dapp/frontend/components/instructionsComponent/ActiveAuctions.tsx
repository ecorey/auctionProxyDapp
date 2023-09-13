import { useEffect, useState } from "react";
import {
  useContractRead,
  useContractWrite,
} from "wagmi";
import ethers from 'ethers';
import { contractABI } from "./contractABI";
import { factoryContractABI } from "./factoryContractAbi";

function ActiveAuctions() {
  const { data, isLoading, isError } = useContractRead({
    address: "0x852e6601868c0F1d7203Eb2faE890172b6401882",
    abi: factoryContractABI,
    functionName: "auctions",
  });

  const [activeAuctions, setActiveAuctions] = useState<string[]>([]);
  const [currentBids, setCurrentBids] = useState<number[]>([]);
  const [bidAmount, setBidAmount] = useState(""); // State for bid amount input

  useEffect(() => {
    if (!data) return;

    const fetchAuctionStatuses = async () => {
      const auctionStatuses = await Promise.all(
        data.map(async (auctionAddress: string) => {
          const statusData = await useContractRead({
            address: `0x${auctionAddress}`,
            abi: contractABI,
            functionName: "getStatus",
          });
          return statusData.data as unknown as number;
        })
      );

      const activeAuctionAddresses = data.filter((_, index) => {
        return auctionStatuses[index] === 1;
      });

      setActiveAuctions(activeAuctionAddresses);
    };

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

  const handleBid = async (auctionAddress: string) => {
    if (!bidAmount) {
      alert("Please enter a bid amount.");
      return;
    }

    try {
      const bidAmountInWei = ethers.parseEther(bidAmount); // Convert bid amount to Wei

      // Here we need to implement bid function from factorycontract

      // Clear the bid amount input after placing the bid
      setBidAmount("");
      alert(`Bid placed successfully: ${bidAmount} ETH`);
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Error placing bid. Please try again.");
    }
  };

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
          <p className="text-lg font-bold font-vt323 italic bg-black rounded-lg text-white p-2 mb-2">
            {auctionAddress}
          </p>
          <p className="text-lg font-bold font-vt323">
            Current Bid: {currentBids[index]} ETH
          </p>
          <input
            type="number"
            placeholder="Enter Bid Amount (ETH)"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="text-lg font-bold font-vt323 mb-2 p-2 mx-44"
            />
          <button
            className="text-lg font-bold font-vt323 italic bg-black rounded-lg text-white p-2 mb-4 mx-44"
            onClick={() => handleBid(auctionAddress)}
          >
            Bid Auction
          </button>
        </div>
      ))}
    </div>
  );
}

export default ActiveAuctions;
