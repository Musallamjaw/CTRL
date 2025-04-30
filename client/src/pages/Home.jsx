import AOS from "aos";
import "aos/dist/aos.css";
import MyTimer from "../components/atoms/MyTimer";
import Navbar from "../components/organism/Navbar";
import ContactForm from "../components/organism/ContactSection";
import AboutUs from "../components/organism/AboutUs";
import ButtonComponent from "../components/atoms/ButtonComponent";
import EventCard from "../components/molecule/EventCard";
import { useSelector } from "react-redux";
import PaginationRounded from "../components/molecule/PaginationRounded";
import { getAllEvents, getCountEvents } from "../api/endpoints/events";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPublishedBlogs } from "../api/endpoints/blogs";
import ClientBlogCard from "../components/molecule/ClientBlogCard";
import UIBlogCard from "../components/molecule/UIBlogCard";
AOS.init();

export default function Home() {
  const authData = useSelector((state) => state.authData);
  const accessToken = authData?.accessToken;
  const [filter, setFilter] = useState("all");
  const [eventsData, setEventsData] = useState([]);
  const [eventsCount, setEventsCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const itemsPerPage = 3;
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchEventsCount = async () => {
      try {
        const eventsRes = await getCountEvents(filter);
        setEventsCount(eventsRes?.data?.count || 0);
        setPageCount(Math.ceil(eventsCount / itemsPerPage));
      } catch (error) {
        alert.error("Error fetching events count:", error);
      }
    };

    const fetchBlogs = async () => {
      try {
        const blogsRes = await getPublishedBlogs();

        console.log("first", blogsRes);
        setBlogs(blogsRes?.data?.data || []);
      } catch (error) {
        alert.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
    fetchEventsCount();
  }, [filter, eventsCount]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await allEventsData(currentPage, filter);
      } catch (error) {
        toast.error("Error fetching events data:", error);
      }
    };

    fetchEvents();
  }, [currentPage, filter]);

  const allEventsData = async (page, filter) => {
    try {
      const response = await getAllEvents(page, filter);
      console.log(" response", response);
      setEventsData(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching events data:", error);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePagination = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <div>
      <Navbar />
      <section
        id="home"
        className="relative bg-ticket-bg bg-no-repeat bg-cover bg-center w-full h-[90vh] flex items-center"
      >
        {/* Background Overlay */}
        <div className="absolute w-full h-full bg-blue-600 bg-opacity-30"></div>

        {/* Content */}
        <div className="relative z-10 text-white flex flex-col justify-center items-center w-full h-full text-center">
          <h1 className="text-2xl md:text-6xl font-black">
            Welcome to <span className="text-base-color">CTRL CLUB</span>
          </h1>
          <h2 className="text-xl md:text-4xl font-black mt-6">
            Discover Our Next Big Event
          </h2>

          {/* Countdown Timer (Bigger & Lower) */}
          <div className="mt-16 text-4xl md:text-6xl">
            <MyTimer />
          </div>

          {/* Buttons */}
          {!accessToken ? (
            <div className="flex flex-col md:flex-row gap-6 mt-16">
              <ButtonComponent
                text={"Log In"}
                path={"/logIn"}
                className="text-lg px-6 py-3"
              />
              <ButtonComponent
                text={"Sign Up"}
                path={"/signUp"}
                className="text-lg px-6 py-3"
              />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 mt-16">
              <ButtonComponent
                text={"My Tickets"}
                path={"/myTickets"}
                className="text-lg px-6 py-3"
              />
            </div>
          )}
        </div>
      </section>

      <AboutUs />

      <div className="max-w-[1300px] mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Latest Blogs
        </h2>
        {/* Container for the feed */}
        <div className="max-w-5xl mx-auto px-4 space-y-8 md:space-y-12">
          {/* Map over blogs and render each card */}
          {blogs.map((blog) => (
            <ClientBlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>

      <section
        id="events"
        className="relative bg-ticket-bg bg-no-repeat bg-cover bg-center w-full"
      >
        <div className="absolute w-full h-full bg-blue-600 bg-opacity-40"></div>
        <div className="max-w-[1300px] mx-auto flex flex-col justify-center items-center">
          <div className="z-10 mt-10 px-4 2xmobile:px-10">
            <div className="border-t-2 border-base-color border-opacity-60 w-44 my-10"></div>
            <h1 className="text-xl xmobile:text-2xl 2xmobile:text-4xl 2md:text-5xl text-gray-800 font-black z-10 text-center">
              Browse Through Our <span className="text-base-color">Events</span>{" "}
              Here.
            </h1>
          </div>
          <div className="z-10 mt-10">
            <label htmlFor="eventFilter" className="mr-2 text-white">
              Filter Events:{" "}
            </label>
            <select
              id="eventFilter"
              value={filter}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Events</option>
              <option value="open">Open Events</option>
              <option value="closed">Closed Events</option>
            </select>
          </div>
          <div className="mt-20 grid z-10 px-4 2xmobile:px-10 mb-20 gap-5">
            {eventsData.length > 0 ? (
              eventsData.map((event) => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  image={event.coverImage}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  eventType={event.eventType}
                  meetingLink={event.meetingLink}
                  location={event.location}
                  price={event.price}
                  capacity={event.capacity}
                  availableTickets={event.availableTickets}
                  homeTickets={"Home"}
                />
              ))
            ) : (
              <div className="text-white text-center mt-10">
                No events found. Please try a different filter.
              </div>
            )}
            {eventsData.length > 0 && (
              <div className="mx-auto mt-20">
                <PaginationRounded
                  count={pageCount}
                  page={currentPage}
                  onChange={handlePagination}
                />
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="second-section flex max-w-[1300px] mx-auto pt-14 pb-28 gap-6 p-4 overflow-hidden">
        <ContactForm />
      </div>
    </div>
  );
}
