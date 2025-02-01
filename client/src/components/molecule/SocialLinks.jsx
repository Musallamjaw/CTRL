import { FaInstagram } from 'react-icons/fa';
import { AiFillTikTok } from "react-icons/ai";

const SocialLinks = () => {
  return (
    <div className="flex 2md:ml-6 ml-3 2md:gap-5 gap-2 items-center">
      <a href="https://www.instagram.com/sweetspot_kw?igsh=NGd4eHdxZTdoam9q" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-rose-600 transition-all duration-500">
        <FaInstagram className="text-2xl" />
      </a>
      <a href="https://www.tiktok.com/@sweetspot_kw" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600 transition-all duration-500">
        <AiFillTikTok className="text-2xl" />
      </a>
    </div>
  );
};

export default SocialLinks;