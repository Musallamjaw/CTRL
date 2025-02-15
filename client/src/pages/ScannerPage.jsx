import { BsQrCodeScan } from "react-icons/bs";
import QrScanner from "../components/organism/QrScanner";
import SpeedDialComponent from "../components/organism/SpeedDialComponent";

export default function ScannerPage() {
  return (
    <div className="bg-blue-50 min-h-screen">
      <SpeedDialComponent />
      <div className="w-fit h-full m-auto px-5 flex">
        <div className="border shadow-2xl shadow-gray-500 rounded-3xl p-4 2xmobile:px-10 w-full flex flex-col justify-center items-center bg-white gap-10 my-auto">
          <div  className="flex items-center mobile:text-xl xmobile:text-2xl 2xmobile:text-4xl md:text-5xl 2md:text-6xl font-black text-gray-700">
            <h1>QR<span className="text-base-color"> Code </span> Scanner</h1>
            <BsQrCodeScan className=" ml-4 2xmobile:ml-10" />
          </div>
          <QrScanner />
        </div>
      </div>
    </div>
  )
}
