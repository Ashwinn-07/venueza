import { useState } from "react";

const AdminUsers = () => {
  // Sample users data
  const initialUsersData = [
    {
      id: 1,
      name: "Jane Cooper",
      email: "jane.cooper@example.com",
      bookings: 5,
      status: "Active",
    },
    {
      id: 2,
      name: "Cody Fisher",
      email: "cody.fisher@example.com",
      bookings: 8,
      status: "Blocked",
    },
    {
      id: 3,
      name: "Esther Howard",
      email: "esther.howard@example.com",
      bookings: 17,
      status: "Active",
    },
    {
      id: 4,
      name: "Jenny Wilson",
      email: "jenny.wilson@example.com",
      bookings: 9,
      status: "Active",
    },
    {
      id: 5,
      name: "Kristin Watson",
      email: "kristin.watson@example.com",
      bookings: 5,
      status: "Active",
    },
    {
      id: 6,
      name: "Cameron Williamson",
      email: "cameron.williamson@example.com",
      bookings: 3,
      status: "Active",
    },
  ];

  const [users, setUsers] = useState(initialUsersData);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBlock = (userId: any) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "Active" ? "Blocked" : "Active";
          // Simple alert instead of toast
          alert(
            `User ${user.name} ${
              newStatus === "Active" ? "unblocked" : "blocked"
            } successfully`
          );
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="search"
                  placeholder="Search"
                  className="pl-10 p-2 border rounded w-full"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Bookings</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.bookings}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className={`px-3 py-1 border rounded text-sm font-medium ${
                            user.status === "Active"
                              ? "border-red-300 text-red-600 hover:bg-red-50"
                              : "border-green-300 text-green-600 hover:bg-green-50"
                          }`}
                          onClick={() => handleToggleBlock(user.id)}
                        >
                          {user.status === "Active" ? "Block" : "Unblock"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredUsers.length}</span> of{" "}
                  <span className="font-medium">{users.length}</span> users
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    &lt;
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-orange-500 text-sm font-medium text-white">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    &gt;
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
