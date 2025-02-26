import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SpeedDialComponent from "./SpeedDialComponent";
import Footer from "./Footer";
import { createTicket, checkTicketStatus } from "../../api/endpoints/tickets";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event || {};
  const userData = useSelector((state) => state.authData.userData);

  const [isLoading, setIsLoading] = useState(false);
  const [isPurchased, setIsPurchased] = useState(true);

  useEffect(() => {
    const fetchTicketStatus = async () => {
      try {
        const response = await checkTicketStatus(userData.id, event.id);
        setIsPurchased(response.data.isPurchased);
      } catch (error) {
        toast.error("Failed to check ticket status");
      }
    };

    if (userData.id && event.id) {
      fetchTicketStatus();
    }
  }, [userData.id, event.id]);

  const handleParticipate = async () => {
    setIsLoading(true);
    try {
      const ticketData = {
        eventData: {
          eventId: event.id,
          title: event.title,
          location: event.location,
          date: event.date,
        },
        userData: {
          userId: userData.id,
          name: userData.name,
          email: userData.email,
        },
        numberOfTickets: 1, // Always 1
      };

      const response = await createTicket(ticketData);
      if (response.status === 400) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        setIsPurchased(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 h-screen relative flex justify-center items-center p-5">
      <SpeedDialComponent />
      <div className="max-w-2xl mx-auto mb-16 md:p-6 p-3 bg-white shadow-md rounded-lg">
        <div className="flex flex-col">
          {/* Event Image */}
          <img
            src={`https://api.ctrl-club.com/uploads/eventsImage/${event.coverImage}`}
            alt={event.title}
            className="w-full lg:min-w-[600px] max-h-[350px] rounded-lg object-cover object-center"
          />

          {/* Event Details */}
          <div className="md:ml-8 mt-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
            <p className="mt-4 text-gray-600">{event.description}</p>

            {/* Participate Button */}
            <button
              onClick={handleParticipate}
              className={`mt-8 text-lg inline-block w-full xmobile:w-2/3 bg-base-color text-white font-semibold py-3 shadow-gray-900 rounded-lg hover:bg-blue-600 text-center hover:shadow-xl transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading || isPurchased}
            >
              {isLoading
                ? "LOADING..."
                : isPurchased
                ? "ALREADY REGISTERED"
                : "REGISTER IN THE EVENT"}
            </button>

            {/* Category and Availability */}
            <div className="mt-8">
              <p className="text-gray-600">
                <strong>Available Tickets:</strong>
                <span className="px-1 font-semibold ml-2 border rounded shadow-inner shadow-gray-300">
                  {event.availableTickets}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute w-full bottom-0">
        <Footer />
      </div>
    </div>
  );
};

export default EventDetails;
