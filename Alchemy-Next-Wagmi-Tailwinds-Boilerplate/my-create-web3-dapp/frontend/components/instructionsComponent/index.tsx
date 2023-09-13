import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";

import { sepolia } from "wagmi";
import { configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { contractABI } from "./contractABI";

function PageBody() {
  return (
    <div>
      <WalletInfo></WalletInfo>
    </div>
  );
}

// FUNCTIONS

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chains, publicClient } = configureChains(
    [sepolia],
    [
      alchemyProvider({ apiKey: "PVsdQRGuGDwT2mm_Hs5ua-cepAVD0caw" }),
      publicProvider(),
    ]
  );

  if (address)
    return (
      <div className="text-1xl font-bold font-vt323">
        <DeployedTime></DeployedTime>
        <AuctionLive></AuctionLive>
        <StartTime></StartTime>
        <StopTime></StopTime>
        <AuctionItem></AuctionItem>
        <GetCurrentBid></GetCurrentBid>
        <Winner></Winner>
      </div>
    );
  if (isConnecting)
    return (
      <div className="text-1xl font-bold font-vt323">
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div className="text-1xl font-bold font-vt323">
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div className="text-1xl font-bold font-vt323">
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}

// READ CONTRACT FUNCTIONS

/**
 * @notice returns the owner of the contract
 */
function Owner() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x22090522d78127110f260131E0743228098Db04A",
    abi: contractABI,

    functionName: "getOwner",
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const owner = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching owner....</div>;
  if (isError) return <div>Error fetching owner</div>;
  return <div>Owner Address: {owner}</div>;
}

/**
 * @notice returns is auction is live
 */
function AuctionLive() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x22090522d78127110f260131E0743228098Db04A",
    abi: contractABI,

    functionName: "auctionLive",
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const live = typeof data === "boolean" ? data : 0;

  if (isLoading) return <div>Fetching if auction is live....</div>;
  if (isError) return <div>Error fetching if auction is live</div>;
  return <div>Auction is Live: {live.toString()}</div>;
}

/**
 * @notice returns the contract deploy time
 */
function DeployedTime() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x22090522d78127110f260131E0743228098Db04A",
    abi: contractABI,

    functionName: "deployedTime",
    onSuccess(data) {
      console.log("Success Data:", data, "Type:", typeof data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const deployedT: any = data;

  if (isLoading) return <div>Fetching deployed time....</div>;
  if (isError) return <div>Error fetching deployed time</div>;
  return <div>Deployed TIme: {deployedT.toString()}</div>;
}

/**
 * @notice returns the aution item
 */
function AuctionItem() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x22090522d78127110f260131E0743228098Db04A",
    abi: contractABI,

    functionName: "getAuctionItem",
    onSuccess(data) {
      console.log("Success Data:", data, "Type:", typeof data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const auctionItem = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching Auction Item....</div>;
  if (isError) return <div>Error fetching Auction Item</div>;
  if (auctionItem == 0) return <div>Auction Item: Coming Soon 🔥🔥🔥</div>;
  return <div>Auction Item: {auctionItem}</div>;
}

// NEEDS TO BE A STATE SO ITS UPDATED
/**
 * @notice returns the current bid for the contract
 */
function GetCurrentBid() {
  const [currentBid, setCurrentBid] = useState<number | null>(null);

  const { data, isError, isLoading } = useContractRead({
    address: "0x22090522d78127110f260131E0743228098Db04A",
    abi: contractABI,

    functionName: "getCurrentBid",
    onSuccess(data) {
      console.log("Success Data:", data, "Type:", typeof data);
      setCurrentBid(Number(data));
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  if (isLoading) return <div>Fetching Current Bid....</div>;
  if (isError) return <div>Error fetching Current Bid</div>;
  if (currentBid == 0) return <div>Current Bid: Starting Soon...🙇 🙇</div>;
  if (currentBid !== null) {
    return <div> console.log(currentBid.toString()); </div>;
  }
}

/**
 * @notice returns the start time
 */
function StartTime() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x22090522d78127110f260131E0743228098Db04A",
    abi: contractABI,

    functionName: "getStartTime",
    onSuccess(data) {
      console.log("Success Data:", data, "Type:", typeof data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const startTime: any = data;

  if (isLoading) return <div>Fetching Start Time....</div>;
  if (isError) return <div>Error Fetchting Start Time</div>;
  if (startTime == 0) return <div>Start Time: Not Set ⏱️ ⏱️ </div>;
  return <div>Current Bid: {startTime.toString()}</div>;
}

/**
 * @notice returns the stop time
 */
function StopTime() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x22090522d78127110f260131E0743228098Db04A",
    abi: contractABI,

    functionName: "getStopTime",
    onSuccess(data) {
      console.log("Success Data:", data, "Type:", typeof data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const stopTime: any = data;

  if (isLoading) return <div>Fetching Stop Time....</div>;
  if (isError) return <div>Error Fetchting Stop Time</div>;
  if (stopTime == 0) return <div>Stop Time: Not Set ⏰ ⏰ </div>;
  return <div>Current Bid: {stopTime.toString()}</div>;
}

/**
 * @notice returns the winner
 */
function Winner() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x22090522d78127110f260131E0743228098Db04A",
    abi: contractABI,

    functionName: "winner",
    onSuccess(data) {
      console.log("Success Data:", data, "Type:", typeof data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const winner: any = data;

  if (isLoading) return <div>Fetching Winner....</div>;
  if (isError) return <div>Error Fetchting Winner</div>;
  if (winner[0] == 0x0000000000000000000000000000000000000000)
    return <div>Winner: Undecided 😱 🤑 😎</div>;
  return <div>Winner: {winner.toString()}</div>;
}

// RETURN FUNCTION
// TITLE AND 2 MAIN COMPONENTS

export default function InstructionsComponent() {
  return (
    <div className="flex flex-col justify-center items-center bg-green-400 w-full min-h-screen">
      {/* Title above the two bordered boxes */}
      <h1 className="text-8xl font-bold font-vt323 mb-4">
        You Dropped This King
      </h1>
      <h1 className="text-4xl font-bold font-vt323 mb-4">
        Auction Clearing House
      </h1>
      <h1 className="text-2xl font-bold font-vt323 italic  mb-4">
        Limited Time
      </h1>

      {/* First bordered area */}
      <div className="border p-4 m-4 w-full max-w-xl flex justify-center">
        {/* Content for the first area goes here */}
        <PageBody></PageBody>
      </div>

      {/* Second area below the first */}
      <div className="border p-4 m-4 w-full max-w-xl flex justify-center">
        {/* Content for the second area goes here */}
        <h1 className="text-3xl underline font-vt323 font-bold text-black bg-green-600">
          <Link
            href="https://www.polytope.net/hedrondude/polytera.htm"
            target="_blank"
          >
            Part of Second Group
          </Link>
        </h1>
      </div>
    </div>
  );
}
