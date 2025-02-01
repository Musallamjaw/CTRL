import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SpeedDialComponent from './SpeedDialComponent';
import Footer from './Footer';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { createTicket } from '../../api/endpoints/tickets';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const EventDetails = () => {
  const location = useLocation();
  const event = location.state?.event || {};

  const userData = useSelector((state) => state.authData.userData);
  //const stop = false;
  const [ticketCount, setTicketCount] = useState(1);
  const totalPrice = ticketCount * event.price;

  const handleTicketChange = (e) => {
    setTicketCount(e.target.value);
  };

  const handlePay = async () => {
    try {
      //if (stop) {
        const ticketData = {
          "eventData": {
            "eventId": event.id,
            "title": event.title,
            "location": event.location,
            "date": event.date
          },
          "userData": {
            "userId": userData.id,
            "name": userData.name,
            "email": userData.email
          },
          "numberOfTickets": ticketCount
        }
        const response = await createTicket(ticketData);
        toast.success(response.data.message)
      //}
      //toast.success('Unfortunately, the ticket purchase service is currently suspended.')
    } catch (error) {
      toast.error(error)
    }

  }

  return (
    <div className="bg-blue-50 h-screen relative flex justify-center items-center p-5">
      <SpeedDialComponent />
      <div className="max-w-2xl mx-auto mb-16 md:p-6 p-3 bg-white shadow-md rounded-lg">
        <div className="flex flex-col">
          {/* Event Image */}
          <img
            src={`https://sweet-spot-server.onrender.com/uploads/eventsImage/${event.coverImage}`}
            alt={event.title}
            className="w-full lg:min-w-[600px] max-h-[350px] rounded-lg object-cover object-center"
          />

          {/* Event Details */}
          <div className="md:ml-8 mt-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
            <span className="text-2xl font-bold text-base-color"><span className='text-gray-800'>KWD</span> <span className='px-1 border rounded shadow-inner shadow-gray-300'>{event.price}</span></span>
            <p className="mt-4 text-gray-600">{event.description}</p>
            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Quantity:
              </label>
              <div className="flex w-fit mx-auto items-center space-x-2">
                <button
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className=" w-12 h-12 flex justify-center items-center border border-gray-300 rounded-lg bg-base-color hover:bg-blue-500"
                >
                  <FaMinus className='text-white' />
                </button>
                <input
                  type="number"
                  value={ticketCount}
                  onChange={handleTicketChange}
                  min="1"
                  max={event.availableTickets}
                  className="w-20 h-12 border border-gray-300 rounded-lg text-center"
                />
                <button
                  onClick={() => setTicketCount(ticketCount + 1)}
                  className=" w-12 h-12 flex justify-center items-center border border-gray-300 rounded-lg bg-base-color hover:bg-blue-500"
                >
                  <FaPlus className='text-white' />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="mt-6">
              <p className="text-xl font-bold text-gray-900">
                Total Price: <span className=''><span className='text-gray-800'>KWD</span> <span className='px-1 border rounded shadow-inner shadow-gray-300'>{totalPrice}</span></span>
              </p>
            </div>

            {/* Add to Cart Button */}
            <button onClick={handlePay} className="mt-8 text-lg inline-block w-full xmobile:w-2/3 bg-base-color text-white font-semibold py-3 shadow-gray-900 rounded-lg hover:bg-blue-600 text-center hover:shadow-xl transition-all duration-300">
              PAY
            </button>

            {/* Category and Availability */}
            <div className="mt-8">
              <p className="text-gray-600"><strong>Availabil Tickets : </strong><span className='px-1 font-semibold ml-2 border rounded shadow-inner shadow-gray-300'>{event.availableTickets}</span></p>
            </div>
          </div>
        </div>
      </div>
      <div className=' absolute w-full bottom-0'>
        <Footer />

      </div>
    </div>
  );
};

export default EventDetails;
