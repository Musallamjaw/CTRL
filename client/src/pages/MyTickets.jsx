import { useSelector } from "react-redux";
import TicketCard from "../components/molecule/TicketCard";
import { useEffect, useState } from "react";
import { getCountUserTickets, getTicketsByUserId } from "../api/endpoints/tickets";
import { toast } from "react-toastify";
import PaginationRounded from "../components/molecule/PaginationRounded";

export default function MyTickets() {
  const userData = useSelector((state) => state.auth.user);
  const [ticketsData, setTicketsData] = useState([]);
  const [ticketsCount, setTicketsCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [filter, setFilter] = useState("unused");
  const itemsPerPage = 6;

  // Function to convert date to UTC format
  const formatDateToUTC = (dateString) => {
    return new Date(dateString).toISOString(); // Converts to ISO 8601 UTC format
  };

  useEffect(() => {
    const fetchTicketsCount = async () => {
      try {
        const ticketsRes = await getCountUserTickets(filter, userData?.id);
        setTicketsCount(ticketsRes?.data?.count || 1);
        setPageCount(Math.ceil((ticketsRes?.data?.count || 1) / itemsPerPage));
      } catch (error) {
        toast.error("Error fetching ticket count: " + error.message);
      }
    };

    fetchTicketsCount();
  }, [filter, userData?.id]); // Removed ticketsCount from dependencies to avoid infinite loop

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTicketsByUserId(userData?.id, currentPage, filter);
        const formattedTickets = response?.data?.map(ticket => ({
          ...ticket,
          date: formatDateToUTC(ticket.date) // Ensure UTC time
        }));
        setTicketsData(formattedTickets || []);
      } catch (error) {
        toast.error("Failed to fetch tickets: " + error.message);
        setTicketsData([]);
      }
    };

    fetchTickets();
  }, [filter, currentPage, userData?.id]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePagination = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="relative w-full bg-blue-600 bg-opacity-40">
      <div className="max-w-[1300px] mx-auto flex flex-col justify-center items-center">
        <div className="z-10 mt-10 px-4 2xmobile:px-10">
          <div className="border-t-2 border-base-color border-opacity-60 w-44 my-10"></div>
          <h1 className="text-gray-800 font-black z-10 text-center text-2xl">
            My Tic<span className="text-base-color">ke</span>ts
          </h1>
        </div>
        <div className="z-10 mt-10">
          <label htmlFor="eventFilter" className="mr-2 text-white">Filter Events: </label>
          <select
            id="eventFilter"
            value={filter}
            onChange={handleFilterChange}
            className="p-2 border rounded-md text-black"
          >
            <option value="unused">Unused Tickets</option>
            <option value="used">Used Tickets</option>
          </select>
        </div>
        <div className="mt-20 grid md:grid-cols-2 slg:grid-cols-3 z-10 px-4 2xmobile:px-10 mb-20 gap-5 lg:gap-10 xl:gap-20">
          {ticketsData.length > 0 ? (
            ticketsData.map((ticket) => (
              <TicketCard
                key={ticket.id}
                event={{
                  ...ticket,
                  date: formatDateToUTC(ticket.date), // Converted to UTC
                  location: ticket.location,
                  status: ticket.status,
                }}
              />
            ))
          ) : (
            <p className="text-gray-600 text-center">No tickets found.</p>
          )}
        </div>
        {ticketsData.length > 0 && (
          <div className="mx-auto mb-20">
            <PaginationRounded count={pageCount} page={currentPage} onChange={handlePagination} />
          </div>
        )}
      </div>
    </div>
  );
}
