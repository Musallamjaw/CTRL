/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import qrimage from "../../assets/images/unnamed.png";
import { Link } from "react-router-dom";

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC", // Ensure UTC time is displayed
  };
  return date.toLocaleDateString("en-US", options);
}


function EventCard({
  image,
  id,
  title,
  description,
  price,
  date,
  location,
  availableTickets,
  capacity,
  homeTickets,
  handleDelete,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = () => {
    handleDelete();
    setShowConfirm(false); // إغلاق النافذة المنبثقة بعد الحذف
  };

  return (
    <div
      className={`2md:flex ${
        homeTickets === "Home" && "xl:min-w-[1100px]"
      } p-1 border bg-blue-200 rounded-xl gap-4 2md:max-h-72 relative`}
    >
      <img
        src={`https://api.ctrl-club.com/uploads/eventsImage/${image}`}
        alt={title}
        className="object-cover w-full rounded-t-lg 2md:h-64 min-h-64 2md:w-96 2md:min-w-64 2md:rounded-none 2md:rounded-s-lg"
      />
      <div className="text-black mt-4 w-full flex flex-col justify-between text-center 2xmobile:text-start overflow-y-auto">
        <div>
          <h5 className="mb-2 text-xl 2xmobile:text-2xl font-bold tracking-tight">
            Event: {title}
          </h5>
          <p className="mb-3 text-sm 2xmobile:text-base font-normal">
            {description}
          </p>
           <p className="mb-2 text-sm 2xmobile:text-base font-semibold tracking-tight">
            Date: {formatDate(date)}
          </p>
          <p className="mb-2 text-sm 2xmobile:text-base font-semibold tracking-tight">
            Location: {location}
          </p>
        </div>
        <div className="w-full flex flex-col 2xmobile:flex-row justify-between gap-2 items-center">
          {availableTickets > 0 ? (
            <span className="py-1 px-3 border rounded-full text-sm bg-green-500 text-white">
              open
            </span>
          ) : (
            <span className="py-1 px-3 border rounded-full text-sm bg-red-500 text-white">
              close
            </span>
          )}

          <p>
            {" "}
            Available Tickets{" "}
            <span className="font-semibold"> {availableTickets}</span> from{" "}
            <span className="font-semibold"> {capacity}</span>
          </p>
          {homeTickets === "Home" && (
            <Link
              to="eventDetails"
              state={{
                event: {
                  id: id,
                  title: title,
                  date: date,
                  description: description,
                  location: location,
                  capacity: capacity,
                  availableTickets: availableTickets,
                  coverImage: image,
                },
              }}
              className="px-4 py-2 font-semibold border border-slate-700 rounded-full hover:text-white hover:bg-base-color transition-all duration-300"
            >
              Join Event
            </Link>
          )}
        </div>
      </div>
      {homeTickets === "User" && (
        <img
          src={qrimage}
          alt={title}
          className="object-cover w-full rounded-t-lg 2md:h-64 min-h-64 2md:w-96 2md:min-w-64 md:rounded-none md:rounded-s-lg mt-10 2md:mt-0"
        />
      )}

      {homeTickets === "Admin" && (
        <div className="absolute left-3 top-3 flex gap-4 bg-gray-200 p-2 rounded-md bg-opacity-90">
          <Link
            to="editEvent"
            state={{
              eventData: {
                id: id,
                title: title,
                date: date,
                description: description,
                location: location,
                capacity: capacity,
                availableTickets: availableTickets,
                coverImage: image,
              },
            }}
            className="text-3xl text-base-color hover:text-blue-500 transition-all duration-300"
          >
            <FaEdit />
          </Link>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="text-3xl text-red-500 hover:text-red-400 transition-all duration-300"
          >
            <FaTrashAlt />
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p className="mb-4 text-center">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventCard;
