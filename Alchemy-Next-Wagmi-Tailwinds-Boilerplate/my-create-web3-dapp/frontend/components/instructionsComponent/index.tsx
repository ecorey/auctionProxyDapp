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
import myImage from "./images/11.gif";
import Link from "next/link";

export default function InstructionsComponent() {
  return (
    <div className="flex flex-col justify-center items-center bg-green-400 w-full min-h-screen">
      {/* First bordered area */}
      <div className="border p-4 m-4 w-full max-w-xl flex justify-center">
        {/* Content for the first area goes here */}
        <h1 className="text-3xl underline font-vt323 font-bold text-black bg-green-600">
          <Link
            href="https://www.polytope.net/hedrondude/polytera.htm"
            target="_blank"
          >
            Part of First Group
          </Link>
        </h1>
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
