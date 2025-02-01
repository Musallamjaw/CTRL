import { FaInstagram } from "react-icons/fa";
import SocialLinks from "../molecule/SocialLinks";
export default function Footer() {
  return (
    <div>
      <footer className="pb-2 2md:pb-4 w-full bg-zinc-200">
        <div className="flex flex-col justify-center 2md:flex-row border-t border-gray-500 mt-4 pt-2 2md:pt-6 text-center 2md:justify-around">
          <div className="flex justify-center">
            <p className="text-gray-700 ">Sweet Spot 2024 © All rights reserved.</p>
            
              <SocialLinks />
          </div>
          <div className="flex gap-5 justify-center">
            <p className="text-gray-700 ">Developed By Nova</p>
            <a href="https://www.instagram.com/nova.luminar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-rose-600 transition-all duration-500">
              <FaInstagram className="text-2xl" />
            </a>
          </div>
        </div>
      </footer>
    </div>

  )
}
