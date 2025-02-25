/* eslint-disable react/prop-types */

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
}

function TicketCard({ image, title, date, status, location }) {
  return (
    <div className={` p-3 border bg-slate-200 rounded-xl gap-4 relative`}>
      <img
        src={`https://ctrl-club.com/uploads/qrcodes/${image}`}
        alt={title}
        className="object-cover rounded-t-lg w-full xl:min-w-80"
      />
      <div className="text-black mt-4 w-full flex flex-col justify-between text-center overflow-y-auto">
        <div>
          <h5 className="mb-2 text-xl 2xmobile:text-2xl font-bold tracking-tight">
            Event: {title}
          </h5>
          <p className="mb-2 text-sm 2xmobile:text-base font-semibold tracking-tight">
            Date: {formatDate(date)}
          </p>
          <p className="mb-2 text-sm 2xmobile:text-base font-semibold tracking-tight">
            Location: {location}
          </p>
        </div>
        <div className="w-full flex flex-col 2xmobile:flex-row justify-center gap-2 items-center">
          {status === "unused" ? (
            <span
              className={`py-1 px-3 border rounded-full text-sm bg-green-500 text-white`}
            >
              Unused
            </span>
          ) : (
            status === "used" && (
              <span
                className={`py-1 px-3 border rounded-full text-sm bg-red-500 text-white`}
              >
                Used
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
