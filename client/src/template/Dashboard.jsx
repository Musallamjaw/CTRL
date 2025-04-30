import DashboardCard from "../components/atoms/DashboardCard";
import { deleteUser, getAllUsers, getCountUsers } from "../api/endpoints/users";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PaginationRounded from "../components/molecule/PaginationRounded";
import { getCountEvents } from "../api/endpoints/events";
import { getCountTickets } from "../api/endpoints/tickets";

export default function Dashboard() {
  const [usersData, setUsersData] = useState([]);
  const [usersCount, setUsersCount] = useState(1);
  const [eventsCount, setEventsCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const pageCount = Math.ceil(usersCount / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, eventsRes, ticketsRes] = await Promise.all([
          getCountUsers(),
          getCountEvents(),
          getCountTickets("all"),
        ]);
        setUsersCount(usersRes?.data?.count || 1);
        setEventsCount(eventsRes?.data?.count || 0);
        setTicketsCount(ticketsRes?.data?.count || 0);
        allUsersData(1);
      } catch (error) {
        toast.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const allUsersData = async (page) => {
    try {
      const response = await getAllUsers(page);
      setUsersData(response?.data || []);
    } catch (error) {
      alert.error("Error fetching users data:", error);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmDelete) {
      try {
        const response = await deleteUser(userId);
        setUsersData((prevUsersData) =>
          prevUsersData.filter((user) => user._id !== userId)
        );
        toast.success(response.data.message);
      } catch (error) {
        alert.error(error.response?.data?.error || "An error occurred");
      }
    }
  };

  const handlePagination = (event, value) => {
    setCurrentPage(value);
    allUsersData(value);
  };

  return (
    <div className="lg:col-span-3 w-full mx-auto lg:ml-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg">
        <DashboardCard title="Users" count={usersCount} />
        <DashboardCard title="All Events" count={eventsCount} />
        <DashboardCard title="All Tickets" count={ticketsCount} />
      </div>

      <div className="bg-white p-6 rounded-lg divide-y border overflow-x-auto">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">
          Admin Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div>
            <p className="text-gray-900 font-semibold">Name</p>
            <p className="text-lg text-gray-600">studentdemo</p>
          </div>
          <div>
            <p className="text-gray-900 font-semibold">Email</p>
            <p className="text-lg text-gray-600">studentdemo@example.com</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg divide-y border">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Users</h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3">
                  Major
                </th>
                <th scope="col" className="px-6 py-3">
                  College
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
          </table>
          <div className="max-h-300 overflow-y-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <tbody>
                {usersData.length > 0 ? (
                  usersData.map((user) => (
                    <tr key={user._id} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phoneNumber}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">{user.major}</td>
                      <td className="px-6 py-4">{user.college}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(user._id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        >
                          Delete User
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {usersData.length > 0 && (
          <div className="mx-auto mt-4">
            <PaginationRounded
              count={pageCount}
              page={currentPage}
              onChange={handlePagination}
            />
          </div>
        )}
      </div>
    </div>
  );
}
