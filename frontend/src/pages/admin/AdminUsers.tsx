import { useState, useEffect } from "react";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";
import { Ban, CheckCircle, Search } from "lucide-react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminUsers = () => {
  const { listAllUsers, updateUserStatus } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (search = "") => {
    setIsLoading(true);
    try {
      const response = await listAllUsers(search);
      setUsers(response.users);
    } catch (error) {
      console.error("Failed to load users:", error);
      notifyError("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers(searchTerm);
  };

  const executeStatusChange = async (userId: string, newStatus: string) => {
    setProcessingUserId(userId);
    try {
      await updateUserStatus(userId, newStatus);
      await loadUsers(searchTerm);

      if (newStatus === "blocked") {
        notifySuccess("User blocked successfully");
      } else {
        notifySuccess("User unblocked successfully");
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
      notifyError(
        error instanceof Error ? error.message : "Failed to update user status"
      );
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleToggleBlock = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    const actionText = newStatus === "blocked" ? "Block" : "Unblock";

    confirmAlert({
      title: `Confirm ${actionText}`,
      message: `Are you sure you want to ${actionText.toLowerCase()} this user?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => executeStatusChange(userId, newStatus),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Users</h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <form onSubmit={handleSearchSubmit} className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search users..."
                    className="pl-10 p-2.5 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex items-center text-sm font-medium rounded-full cursor-pointer ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status === "active" ? (
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                          ) : (
                            <Ban className="w-4 h-4 mr-1.5" />
                          )}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className={`px-3.5 py-1.5 rounded-lg flex items-center text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                            user.status === "active"
                              ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                              : "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
                          }`}
                          onClick={() =>
                            handleToggleBlock(user._id, user.status)
                          }
                          disabled={processingUserId === user._id}
                        >
                          {processingUserId === user._id ? (
                            <span>Processing...</span>
                          ) : user.status === "active" ? (
                            <>
                              <Ban className="w-4 h-4 mr-1.5" />
                              Block
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1.5 " />
                              Unblock
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {indexOfFirstItem + 1} -{" "}
                    {Math.min(indexOfLastItem, users.length)}
                  </span>{" "}
                  of <span className="font-medium">{users.length}</span> users
                </p>
                <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition duration-150 cursor-pointer">
                    {currentPage}
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
