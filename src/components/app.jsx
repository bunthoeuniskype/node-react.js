// src/components/app.tsx

// Import necessary dependencies
import React, { useEffect, useState } from 'react'

// Create interface for user object (TypeScript only)
// interface UserUI {
//   id: string;
//   username: string;
//   name: string;
//   email: string;
// }

// Create App component
function App() {
  // Prepare state hook for welcome message
  const [welcomeMessage, setWelcomeMessage] = useState('')

  // Prepare state hook for users list
  // Note: <UserUI[]> is for TypeScript
  // It specifies the shape of usersList state
//   const [usersList, setUsersList] = useState<UserUI[]>([])
const [usersList, setUsersList] = useState([])

  // Use useEffect to call fetchMessage() on initial render
  useEffect(() => {
    fetchUsers()
  }, [])

  // Create async function for fetching users list
  const fetchUsers = async () => {
    const users = await fetch('/api/customers')
      .then(res => res.json()) // Process the incoming data

    // Update usersList state
    setUsersList(users)
  }

  return (
    <div className="app">
      <header className="app-header">
        {/* Display welcome message */}
        <p>{welcomeMessage}</p>

        {/* Button to fetch users data */}
    

        {/* Display table of users after fetching users data */}
        {usersList.length > 0 && <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {usersList.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.active}</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </header>
    </div>
  )
}

export default App