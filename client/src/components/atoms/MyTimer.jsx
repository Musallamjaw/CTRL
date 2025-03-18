import { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { getClosestEvent } from '../../api/endpoints/events';


// eslint-disable-next-line react/prop-types
function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    hours,
    days,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  return (
    <div data-aos="zoom-in" data-aos-duration="2000" style={{ textAlign: 'center' }}>
      <div className='xmobile:flex gap-5 2xmobile:gap-10 text-[50px] 2xmobile:text-[80px] md:text-[100px] 2md:gap-20 text-center'>
        <div className='flex gap-5 2xmobile:gap-10 2md:gap-20 justify-center'>
          <span>{days}<p className='text-lg md:text-2xl font-black'>Days</p></span>
          <span>{hours}<p className='text-lg md:text-2xl font-black'>Hours</p></span>
        </div>
        <div className='flex gap-5 2xmobile:gap-10 2md:gap-20 justify-center'>
          <span>{minutes}<p className='text-lg md:text-2xl font-black'>Minutes</p></span>
          <span>{seconds}<p className='text-lg md:text-2xl font-black'>Seconds</p></span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [eventDate, setEventDate] = useState(null);
  const [noEventsMessage, setNoEventsMessage] = useState('');

  useEffect(() => {
    const fetchClosestEvent = async () => {
      try {
        const response = await getClosestEvent();
        const closestEvent = response.data;

        if (closestEvent && closestEvent.date) {
          setEventDate(new Date(closestEvent.date));
        } else if (closestEvent.message === 'There are no upcoming events.') {
          setNoEventsMessage('There are no upcoming events.');
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setNoEventsMessage('Coming Soon!');
      }
    };

    fetchClosestEvent();
  }, []);

  if (noEventsMessage) {
    return <p className='2xmobile:text-lg text-white md:text-2xl font-black z-10 mt-7'>{noEventsMessage}</p>;
  }

  if (!eventDate) {
    return <p className='2xmobile:text-lg text-white md:text-2xl font-black z-10 mt-7'>Loading...</p>;
  }

  return (
    <div className='z-10'>
      <MyTimer expiryTimestamp={eventDate} />
    </div>
  );
}
