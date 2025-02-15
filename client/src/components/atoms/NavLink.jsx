/* eslint-disable react/prop-types */
import { Link, NavLink } from "react-router-dom";
import { navLinks } from "../../constants/navLinks";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const NavLinks = ({ linksLayout, bgColor, handleNavButton }) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const linkStyle =
    linksLayout === "halfPage" ? 'group-hover:ml-4' : 'font-semibold'

  const dropdownStyle =
    linksLayout === "halfPage" ? 'bg-white text-[#0E384C] top-40 left-32' : 'bg-[#0E384C] text-white top-20 shadow-gray-400'

  const secLinkStyle =
    linksLayout === "halfPage" ? 'hover:bg-gray-300 ' : ' hover:bg-[#14506c]'

  const linkColor =
    bgColor === "light" ?
      'text-[#0E384C] hover:text-[#43a1db]'
      :
      'text-white group-hover:text-[#43a1db] font-semibold'
  return (
    <>
      {navLinks.map((link, index) => (
        link.label !== 'MainDoctor' ? (
          <li key={index} className={`${linksLayout === 'halfPage' && 'group w-full'}`
          } >
            <NavLink
              to={link.path}
              onClick={handleNavButton}
              className={`text-base ${linkStyle} ${linkColor} transition-all duration-500`}
            >
              {link.label}
            </NavLink>
          </li>
        ) : (
          <li key={index} className={`${linksLayout === 'halfPage' && 'group w-full'}`}>
            <button onClick={toggleDropdown} className={`flex items-center gap-2 text-base transition-all duration-500 relative font-bold ${linkColor}`}>
              MainDoctor <MdKeyboardArrowDown className="text-xl"/>
            </button>
            {isDropdownOpen && (
              <div id="dropdown" className={`absolute z-[100] divide-y divide-gray-100 rounded-lg w-44 shadow-lg font-semibold ${dropdownStyle}`}>
                <ul className="py-2 text-sm">
                  <li>
                    <Link to="/mainDoctor" onClick={toggleDropdown} className={`block px-4 py-2 ${secLinkStyle}`}>Appointments</Link>
                  </li>
                  <li>
                    <Link to="/mainDoctor/patientRecords" onClick={toggleDropdown} className={`block px-4 py-2 ${secLinkStyle}`}>Patient Records</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        )
      ))}
    </>
  );
};

export default NavLinks;