import { useEffect, useState } from 'react';
import { PiNavigationArrowFill } from 'react-icons/pi';
import { FaHome, FaTicketAlt } from 'react-icons/fa';
import { IoLogIn, IoLogOut } from 'react-icons/io5';
import { BsQrCodeScan } from 'react-icons/bs';
import { IoMdPersonAdd } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { RiAdminFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../api/endpoints/auth';
import { deleteAuthData } from '../../features/authData/authDataSlice';

const SpeedDialComponent = () => {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authData);
  const accessToken = authData?.accessToken;
  const userRole = authData?.userData?.role;
  const [dialState, setDialState] = useState(true)
  const [dialHeight, setDialHeight] = useState('h-[354px]')

  useEffect(() => {
    if (userRole === 'admin') {
      setDialHeight('h-[295px]')
    } else if (accessToken && userRole === 'user') {
      setDialHeight('h-[177px]')
    } else {
      setDialHeight('h-[177px]')
    }

  }, [accessToken, userRole])


  const openDial = () => {
    setDialState(!dialState)
  }

  const handleLogOut = async () => {
    await logOut()
    dispatch(deleteAuthData());
  }
  return (
    <div data-dial-init className="fixed end-8 bottom-12 z-[300]">
      <div id="speed-dial-menu-click" className={`flex flex-col items-center mb-4 space-y-2 overflow-y-hidden  ${!dialState ? `opacity-100 ${dialHeight}` : 'h-0 opacity-0'} transition-all duration-500`}>

        {!accessToken ? (
          <>
            <Link
              to={"/logIn"}
              className="flex group justify-center items-center w-[52px] h-[52px] text-gray-700 bg-gray-100 hover:bg-gray-700 hover:text-gray-100 rounded-full border border-gray-600 shadow-sm focus:ring-4 focus:outline-none focus:ring-gray-400 transition-all duration-300"
            >
              <IoLogIn className='text-2xl' />
              <div className="absolute group-hover:visible invisible z-[200] flex left-[-69px] w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
                Log In
                <div className='w-3 h-3 absolute bg-gray-900 rotate-45 -right-1 top-[11px]'></div>
              </div>
            </Link>
            <Link
              to={"/signUp"}
              className="flex group justify-center items-center w-[52px] h-[52px] text-gray-700 bg-gray-100 hover:bg-gray-700 hover:text-gray-100 rounded-full border border-gray-600 shadow-sm focus:ring-4 focus:outline-none focus:ring-gray-400 transition-all duration-300"
            >
              <IoMdPersonAdd className='text-xl' />
              <div className="absolute group-hover:visible invisible z-[200] flex left-[-80px] w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
                Sign Up
                <div className='w-3 h-3 absolute bg-gray-900 rotate-45 -right-1 top-[11px]'></div>
              </div>
            </Link>
          </>
        ) : (
          <button
            type="button"
            onClick={handleLogOut}
            className="flex group justify-center items-center w-[52px] h-[52px] text-gray-50 bg-red-500 hover:bg-gray-100 hover:text-red-500 rounded-full border border-gray-600 shadow-sm focus:ring-4 focus:outline-none focus:ring-red-400 transition-all duration-300"
          >
            <IoLogOut className='text-2xl' />
            <div className="absolute group-hover:visible invisible z-[200] flex left-[-80px] w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
              Log Out
              <div className='w-3 h-3 absolute bg-gray-900 rotate-45 -right-1 top-[11px]'></div>
            </div>
          </button>
        )}
        {(accessToken && userRole !== 'scanner') && (
          <Link
            to={"/myTickets"}
            className="flex group justify-center items-center w-[52px] h-[52px] text-gray-700 bg-gray-100 hover:bg-gray-700 hover:text-gray-100 rounded-full border border-gray-600 shadow-sm focus:ring-4 focus:outline-none focus:ring-gray-400 transition-all duration-300"
          >
            <FaTicketAlt className='text-xl' />
            <div className="absolute group-hover:visible invisible z-[200] flex left-[-98px] w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
              My Tickets
              <div className='w-3 h-3 absolute bg-gray-900 rotate-45 -right-1 top-[11px]'></div>
            </div>
          </Link>
        )}
        {(accessToken && userRole === 'admin' || userRole === 'scanner') &&
          <Link
            to={"/qrScanner"}
            className="flex group justify-center items-center w-[52px] h-[52px] text-gray-700 bg-gray-100 hover:bg-gray-700 hover:text-gray-100 rounded-full border border-gray-600 shadow-sm focus:ring-4 focus:outline-none focus:ring-gray-400 transition-all duration-300"
          >
            <BsQrCodeScan className='text-xl' />
            <div className="absolute group-hover:visible invisible z-[200] flex left-[-110px] w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
              QR Scanner
              <div className='w-3 h-3 absolute bg-gray-900 rotate-45 -right-1 top-[11px]'></div>
            </div>
          </Link>
        }
        {(accessToken && userRole === 'admin') &&
          <Link
            to={"/admin"}
            className="flex group justify-center items-center w-[52px] h-[52px] text-gray-700 bg-gray-100 hover:bg-gray-700 hover:text-gray-100 rounded-full border border-gray-600 shadow-sm focus:ring-4 focus:outline-none focus:ring-gray-400 transition-all duration-300"
          >
            <RiAdminFill className='text-2xl' />
            <div className="absolute group-hover:visible invisible z-[200] flex left-[-74px] w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
              Admin
              <div className='w-3 h-3 absolute bg-gray-900 rotate-45 -right-1 top-[11px]'></div>
            </div>
          </Link>
        }

        <Link
          to={"/"}
          className="flex group justify-center items-center w-[52px] h-[52px] text-gray-700 bg-gray-100 hover:bg-gray-700 hover:text-gray-100 rounded-full border border-gray-600 shadow-sm focus:ring-4 focus:outline-none focus:ring-gray-400 transition-all duration-300"
        >
          <FaHome className='text-2xl' />
          <div className="absolute group-hover:visible invisible z-[200] flex left-[-69px] w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
            Home
            <div className='w-3 h-3 absolute bg-gray-900 rotate-45 -right-1 top-[11px]'></div>
          </div>
        </Link>
        {/* Repeat for other buttons */}
      </div>
      <button
        type="button"
        data-dial-toggle="speed-dial-menu-click"
        data-dial-trigger="click"
        aria-controls="speed-dial-menu-click"
        aria-expanded="false"
        onClick={openDial}
        className="group flex items-center justify-center border-2 text-white bg-base-color rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
      >
        <PiNavigationArrowFill className='text-xl group-hover:rotate-45 transition-all duration-300' />
        <span className="sr-only">Open actions menu</span>
      </button>
    </div >
  );
};

export default SpeedDialComponent;
