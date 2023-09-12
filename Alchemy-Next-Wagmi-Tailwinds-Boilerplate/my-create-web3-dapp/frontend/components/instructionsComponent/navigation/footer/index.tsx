import Image from "next/image";
import myImage from "./images/99.png";

export default function Footer() {
  return (
    <div className="flex items-center justify-center h-32 bg-green-600 ">
      <Image src={myImage} alt="Description" width={152} height={152} />
    </div>
  );
}
