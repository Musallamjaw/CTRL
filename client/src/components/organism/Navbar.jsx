import mainLogo from "../../assets/images/projectMainLogo.png";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  const [isHalfScreen, setIsHalfScreen] = useState(window.innerWidth > 950);
  const [openNav, setOpenNav] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsHalfScreen(window.innerWidth > 950);
      if (isHalfScreen !== window.innerWidth > 950) {
        setOpenNav(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // إذا تم التمرير لأكثر من 50 بكسل
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [isHalfScreen]);

  const handleNavButton = () => {
    setOpenNav(!openNav);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed w-full z-[100]">
      <header
        className={`flex items-center justify-between max-w-[1300px] min-w-[260px] bg-slate-100 rounded-full mt-5 p-3 xl:mx-auto mx-5 relative`}>
        <Link to="/">
          <img src={mainLogo} alt="Logo" className="max-w-32 max-h-16 ml-6" />
        </Link>
        {isHalfScreen ? (
          <div className="flex mr-4 gap-6">
            <button
              onClick={() => scrollToSection('home')}
              className={`font-semibold px-3 py-[6px] rounded-full transition-all duration-300 ${activeSection === 'home' ? 'bg-base-color text-white' : 'hover:bg-base-color hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`font-semibold px-3 py-[6px] rounded-full transition-all duration-300 ${activeSection === 'about' ? 'bg-base-color text-white' : 'hover:bg-base-color hover:text-white'}`}
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('events')}
              className={`font-semibold px-3 py-[6px] rounded-full transition-all duration-300 ${activeSection === 'events' ? 'bg-base-color text-white' : 'hover:bg-base-color hover:text-white'}`}
            >
              Events
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`font-semibold px-3 py-[6px] rounded-full transition-all duration-300 ${activeSection === 'contact' ? 'bg-base-color text-white' : 'hover:bg-base-color hover:text-white'}`}
            >
              Contact Us
            </button>
          </div>
        ) : (
          <button type="button" onClick={handleNavButton} className="flex justify-center items-center w-10 h-10 min-w-10 mr-4 rounded-md rounded-r-md bg-base-color">
            {!openNav ? <FaBars className="text-white text-2xl" /> : <IoMdClose className="text-white text-3xl" />}
          </button>
        )}
        <div
          className={`absolute bg-zinc-100 right-2 left-2 z-50 rounded-[3rem] p-5 transition-all duration-300 ${openNav && !isHalfScreen ? "top-24 opacity-100" : "-top-96 opacity-0"}`}>
          <div className="flex flex-col w-full justify-between ml-4">
            <div className="flex flex-col flex-1 gap-4 justify-start items-start w-full ">
              <button
                onClick={() => scrollToSection('home')}
                className={`font-semibold px-3 py-[6px] rounded-full transition-all duration-300 ${activeSection === 'home' ? 'bg-base-color text-white' : 'hover:bg-base-color hover:text-white'}`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`font-semibold px-3 py-[6px] rounded-full transition-all duration-300 ${activeSection === 'about' ? 'bg-base-color text-white' : 'hover:bg-base-color hover:text-white'}`}
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('events')}
                className={`font-semibold px-3 py-[6px] rounded-full transition-all duration-300 ${activeSection === 'events' ? 'bg-base-color text-white' : 'hover:bg-base-color hover:text-white'}`}
              >
                Events
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`font-semibold px-3 py-[6px] rounded-full transition-all duration-300 ${activeSection === 'contact' ? 'bg-base-color text-white' : 'hover:bg-base-color hover:text-white'}`}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
