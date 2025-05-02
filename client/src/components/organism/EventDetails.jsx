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
        numberOfTickets: 1,
      };

      const response = await createTicket(ticketData);
      if (response.status === 400) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        setIsPurchased(true);

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
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen relative flex flex-col items-center justify-start p-3 md:p-6">
      <SpeedDialComponent />
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 sm:p-6 mb-24">
        <div className="flex flex-col">
          {/* Event Image */}
          <img
            src={`https://api.ctrl-club.com/uploads/eventsImage/${event.coverImage}`}
            alt={event.title}
            className="w-full h-[200px] sm:h-[300px] lg:h-[350px] rounded-lg object-cover object-center"
          />

          {/* Event Details */}
          <div className="mt-5 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {event.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              {event.description}
            </p>

            {event.eventType !== "online" && (
              <div className="mt-3">
                <span className="inline-block px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                  In-Person Event
                </span>
              </div>
            )}

            <div className="mt-4 text-sm sm:text-base text-gray-600">
              <p>
                <strong>Location:</strong>{" "}
                {event.eventType === "online" ? "Online Event" : event.location}
              </p>
              <p className="mt-1">
                <strong>Date:</strong>{" "}
                {new Date(
                  new Date(event.date).getTime() - 3 * 60 * 60 * 1000
                ).toLocaleString("en-US", {
                  timeZone: "Asia/Kuwait",
                })}
              </p>
            </div>

            {/* Participate Button */}
            <div className="mt-6">
              {event.availableTickets === 0 && !isPurchased ? (
                <button
                  disabled
                  className="w-full py-3 rounded-lg text-white font-semibold bg-red-500 opacity-70 cursor-not-allowed"
                >
                  Event Closed
                </button>
              ) : (
                <button
                  onClick={handleParticipate}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : event.eventType === "online" && isPurchased
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-base-color hover:bg-blue-600"
                  }`}
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
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default EventDetails;
