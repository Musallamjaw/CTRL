import { useEffect, useState } from "react";
import PaginationRounded from "../components/molecule/PaginationRounded";
import EventCard from "../components/molecule/EventCard";
import { deleteEvent, getAllEvents, getCountEvents } from "../api/endpoints/events";
import { toast } from "react-toastify";

export default function AllEvents() {
  const [filter, setFilter] = useState('open');
  const [eventsData, setEventsData] = useState([]);
  const [eventsCount, setEventsCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchEventsCount = async () => {
      try {
        const eventsRes = await getCountEvents(filter);
        setEventsCount(eventsRes?.data?.count || 0);
        setPageCount(Math.ceil(eventsCount / itemsPerPage))
      } catch (error) {
        alert.error("Error fetching events count:", error);
      }
    };

    fetchEventsCount();
  }, [filter, eventsCount]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await allEventsData(currentPage, filter);
        
      } catch (error) {
        alert.error("Error fetching events data:", error);
      }
    };

    fetchEvents();
  }, [currentPage, filter]);

  const allEventsData = async (page, filter) => {
    try {
      const response = await getAllEvents(page, filter);
      setEventsData(response?.data || []);
    } catch (error) {
      toast.error("Error fetching events data:", error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await deleteEvent(eventId);
      
      setEventsData((prevEventsData) => prevEventsData.filter(event => event._id !== eventId));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
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
    <div className="lg:col-span-3 w-full mx-auto lg:ml-6 bg-white rounded-lg">
      <div className='p-6 border rounded-t-lg'>
        <h1 className='text-2xl font-semibold text-blue-900 '>All Events</h1>
      </div>
      <div className="z-10 mt-10 flex justify-center items-center gap-4">
        <label htmlFor="eventFilter" className=" text-black">Filter Events: </label>
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
      <div className='p-6 space-y-6'>
        {eventsData.map(event => (
          <EventCard
            key={event._id}
            id={event._id}
            image={event.coverImage}
            title={event.title}
            description={event.description}
            date={event.date}
            location={event.location}
            price={event.price}
            capacity={event.capacity}
            availableTickets={event.availableTickets}
            homeTickets={'Admin'}
            handleDelete={() => handleDelete(event._id)}
          />
        ))}

        {eventsData.length > 0 &&
          <div className="mx-auto mt-20">
            <PaginationRounded count={pageCount} page={currentPage} onChange={handlePagination} />
          </div>
        }
      </div>
    </div>
  )
}
