import { useSelector } from "react-redux";
import TicketCard from "../components/molecule/TicketCard";
import { useEffect, useState } from "react";
import { getCountUserTickets, getTicketsByUserId } from "../api/endpoints/tickets";
import { toast } from "react-toastify";
import PaginationRounded from "../components/molecule/PaginationRounded";

export default function MyTickets() {
  const userData = useSelector((state) => state.authData.userData);
  const [filter, setFilter] = useState('unused');
  const [ticketsData, setTicketsData] = useState([]);
  const [ticketsCount, setTicketsCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchTicketsCount = async () => {
      try {
        const ticketsRes = await getCountUserTickets(filter, userData?.id);
        setTicketsCount(ticketsRes?.data?.count || 0);
        setPageCount(Math.ceil(ticketsCount / itemsPerPage))
      } catch (error) {
        alert.error("Error fetching events count:", error);
      }
    };

    fetchTicketsCount();
  }, [filter, ticketsCount, userData?.id]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        await getUserTickets(userData.id, currentPage, filter);
      } catch (error) {
        alert.error("Error fetching events data:", error);
      }
    };

    fetchTickets();
  }, [currentPage, filter, userData?.id]);

  const getUserTickets = async (id, page, filter) => {
    try {
      const response = await getTicketsByUserId(id, page, filter);
      setTicketsData(response?.data || []);
    } catch (error) {
      toast.error("Failed to fetch tickets: " + error.message);
      setTicketsData([]);
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
    <section id="events" className="relative bg-ticket-bg bg-no-repeat bg-cover bg-center w-full">
      <div className='absolute w-full h-full bg-blue-600 bg-opacity-40'></div>
      <div className="max-w-[1300px] mx-auto flex flex-col justify-center items-center">
        <div className="z-10 mt-10 px-4 2xmobile:px-10">
          <div className="border-t-2 border-base-color border-opacity-60 w-44 my-10"></div>
          <h1 className="text-xl xmobile:text-2xl 2xmobile:text-4xl 2md:text-5xl text-gray-800 font-black z-10 text-center">My Tic<span className="text-base-color">ke</span>ts</h1>
        </div>
        <div className="z-10 mt-10">
          <label htmlFor="eventFilter" className="mr-2 text-white">Filter Events: </label>
          <select
            id="eventFilter"
            value={filter}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Tickets</option>
            <option value="unused">Unused Tickets</option>
            <option value="used">Used Tickets</option>
          </select>
        </div>
        <div className="mt-20 grid md:grid-cols-2 slg:grid-cols-3 z-10 px-4 2xmobile:px-10 mb-20 gap-5 lg:gap-10 xl:gap-20">
          {ticketsData.length > 0 ? (
            ticketsData.map(event => (
              <TicketCard
                key={event._id}
                image={event.qrCode}
                title={event.eventData.title}
                date={event.eventData.date}
                location={event.eventData.location}
                status={event.status}
              />
            ))
          ) : (
            <p className="text-gray-600 text-center">No tickets found.</p>
          )}
        </div>
        {ticketsData.length > 0 &&
          <div className="mx-auto mb-20">
            <PaginationRounded count={pageCount} page={currentPage} onChange={handlePagination} />
          </div>
        }
      </div>
    </section>
  );
}
