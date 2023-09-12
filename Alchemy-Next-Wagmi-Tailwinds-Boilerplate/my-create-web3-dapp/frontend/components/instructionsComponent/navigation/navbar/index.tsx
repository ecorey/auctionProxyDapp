import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ConnectKitButton } from "connectkit";

function CurrentTime() {
  const [currentTimestamp, setCurrentTimestamp] = useState(
    Math.floor(Date.now() / 1000)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <h4 className="font-bold">
      <p>Current time is: {currentTimestamp}</p>
    </h4>
  );
}

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between h-16 bg-green-600 p-4">
      <CurrentTime />

      <div className="flex flex-col items-end">
        <ConnectKitButton />
      </div>
    </nav>
  );
}
