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
    // For online events, redirect immediately to the meeting link if already registered
    if (event.eventType === "online" && isPurchased && event.meetingLink) {
      window.open(event.meetingLink, "_blank");
      return;
    }

    setIsLoading(true);
    try {
      const ticketData = {
        eventData: {
          eventId: event.id,
          title: event.title,
          location: event.location,
          meetingLink: event.meetingLink,
          eventType: event.eventType,
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

        // For online events, redirect to meeting link after registration
        if (event.eventType === "online" && event.meetingLink) {
          setTimeout(() => {
            window.open(event.meetingLink, "_blank");
            navigate("/");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
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
            {/* Event Type Badge */}
            {event.eventType === "online" ? null : (
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    event.eventType === "online" ? "" : "bg-green-500"
                  } text-white`}
                >
                  {event.eventType === "online" ? "" : "In-Person Event"}
                </span>
              </div>
            )}
            {/* Location/Meeting Link */}
            <div className="mt-4">
              {event.eventType === "online" && isPurchased ? ( //     rel="noopener noreferrer" //     target="_blank" //     href={event.meetingLink} //   <a //   <strong>Meeting Link:</strong> // <p className="text-gray-600">
                //     className="text-blue-500 hover:underline ml-2"
                //   >
                //     Click to join
                //   </a>
                // </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> {event.eventType}
                </p>
              ) : (
                <p className="text-gray-600">
                  <strong>Location:</strong> {event.location}
                </p>
              )}
            </div>
            {/* Date */}
            <p className="mt-2 text-gray-600">
              <strong>Date:</strong> {new Date(event.date).toLocaleString()}
            </p>
            {/* Participate Button */}
            {event.availableTickets === 0 && !isPurchased ? (
              <button
                onClick={null}
                className={`mt-8 text-lg inline-block w-full xmobile:w-2/3 bg-red-500 text-white font-semibold py-3 shadow-gray-900 rounded-lg hover:bg-blue-600 text-center hover:shadow-xl transition-all duration-300 cursor-not-allowed`}
                disabled={true}
              >
                Event Closed
              </button>
            ) : (
              <button
                onClick={handleParticipate}
                className={`mt-8 text-lg inline-block w-full xmobile:w-2/3 ${
                  event.eventType === "online" && isPurchased
                    ? "bg-blue-600"
                    : "bg-base-color"
                } text-white font-semibold py-3 shadow-gray-900 rounded-lg hover:bg-blue-600 text-center hover:shadow-xl transition-all duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading
                  ? "LOADING..."
                  : isPurchased
                  ? event.eventType === "online"
                    ? "JOIN MEETING NOW"
                    : "ALREADY REGISTERED"
                  : "REGISTER IN THE EVENT"}
              </button>
            )}
            {/* Category and Availability
            <div className="mt-8">
              <p className="text-gray-600">
                <strong>Available Tickets:</strong>
                <span className="px-1 font-semibold ml-2 border rounded shadow-inner shadow-gray-300">
                  {event.availableTickets}
                </span>
              </p>
            </div> */}
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
