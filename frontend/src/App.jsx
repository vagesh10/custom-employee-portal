import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const applications = [
  {
    name: "Zoho People",
    description: "HR and employee management",
    permission: "HR",
    url: "https://people.zoho.com/",
    color: "#7c3aed",
  },
  {
    name: "Zoho CRM",
    description: "Customer relationship management",
    permission: "Sales",
    url: "https://crm.zoho.com/",
    color: "#2563eb",
  },
  {
    name: "Zoho Desk",
    description: "Customer support and ticket management",
    permission: "Support",
    url: "https://desk.zoho.com/",
    color: "#059669",
  },
  {
    name: "Zoho Books",
    description: "Finance and accounting",
    permission: "Finance",
    url: "https://books.zoho.com/",
    color: "#ea580c",
  },
];

const roles = [
  "Admin",
  "HR",
  "Sales",
  "Support",
  "Finance",
];

function App() {
  // =========================
  // LOGIN STATE
  // =========================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // =========================
  // USER MANAGEMENT STATE
  // =========================

  const [showUsers, setShowUsers] = useState(false);

  const [users, setUsers] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "HR",
  });

  const [userMessage, setUserMessage] = useState("");

  // =========================
  // AUDIT LOG STATE
  // =========================

  const [showAuditLogs, setShowAuditLogs] =
    useState(false);

  const [auditLogs, setAuditLogs] = useState([]);

  const [loadingLogs, setLoadingLogs] = useState(false);

  const [auditMessage, setAuditMessage] = useState("");

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Login failed"
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to server"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    setEmail("");
    setPassword("");

    setShowUsers(false);
    setShowAuditLogs(false);
  };

  // =========================
  // GET USERS
  // =========================

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      setUserMessage("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUserMessage(
          data.message ||
            "Failed to fetch users"
        );

        return;
      }

      setUsers(data.users);
    } catch (error) {
      console.error(error);

      setUserMessage(
        "Unable to connect to server"
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  // =========================
  // OPEN MANAGE USERS
  // =========================

  const handleManageUsers = () => {
    setShowUsers(true);

    setShowAuditLogs(false);

    fetchUsers();
  };

  // =========================
  // CREATE USER
  // =========================

  const handleCreateUser = async (e) => {
    e.preventDefault();

    setUserMessage("");

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/users`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(newUser),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUserMessage(
          data.message ||
            "Failed to create user"
        );

        return;
      }

      setUserMessage(
        "User created successfully"
      );

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "HR",
      });

      setShowAddUser(false);

      fetchUsers();
    } catch (error) {
      console.error(error);

      setUserMessage(
        "Unable to connect to server"
      );
    }
  };

  // =========================
  // UPDATE USER ROLE
  // =========================

  const handleRoleChange = async (
    userId,
    role
  ) => {
    try {
      setUserMessage("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/users/${userId}/role`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUserMessage(
          data.message ||
            "Failed to update role"
        );

        return;
      }

      setUserMessage(
        "User role updated successfully"
      );

      fetchUsers();
    } catch (error) {
      console.error(error);

      setUserMessage(
        "Unable to connect to server"
      );
    }
  };

  // =========================
  // ACTIVATE / DEACTIVATE
  // =========================

  const handleStatusChange = async (
    userId,
    isActive
  ) => {
    try {
      setUserMessage("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/users/${userId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            is_active: isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUserMessage(
          data.message ||
            "Failed to update status"
        );

        return;
      }

      setUserMessage(
        isActive
          ? "User activated successfully"
          : "User deactivated successfully"
      );

      fetchUsers();
    } catch (error) {
      console.error(error);

      setUserMessage(
        "Unable to connect to server"
      );
    }
  };

  // =========================
  // GET AUDIT LOGS
  // =========================

  const fetchAuditLogs = async () => {
    try {
      setLoadingLogs(true);

      setAuditMessage("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/audit-logs`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAuditMessage(
          data.message ||
            "Failed to fetch audit logs"
        );

        return;
      }

      setAuditLogs(data.logs);
    } catch (error) {
      console.error(error);

      setAuditMessage(
        "Unable to connect to server"
      );
    } finally {
      setLoadingLogs(false);
    }
  };

  // =========================
  // OPEN AUDIT LOGS
  // =========================

  const handleAuditLogs = () => {
    setShowAuditLogs(true);

    setShowUsers(false);

    fetchAuditLogs();
  };

  // =========================
  // DASHBOARD
  // =========================

  if (user) {
    const visibleApplications =
      user.role === "Admin"
        ? applications
        : applications.filter(
            (app) =>
              app.permission === user.role
          );

    return (
      <div style={styles.dashboard}>
        {/* =========================
            HEADER
        ========================= */}

        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>
              Employee Portal
            </h1>

            <p style={styles.headerSubtitle}>
              Authorized Applications
            </p>
          </div>

          <div style={styles.userSection}>
            <div>
              <strong>{user.name}</strong>

              <div style={styles.role}>
                {user.role}
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </header>

        {/* =========================
            MAIN
        ========================= */}

        <main style={styles.main}>
          {/* WELCOME */}

          <div style={styles.welcome}>
            <h2>
              Welcome, {user.name}
            </h2>

            <p>
              You are logged in as{" "}
              <strong>
                {user.role}
              </strong>
              .
            </p>
          </div>

          {/* =========================
              ZOHO APPLICATIONS
          ========================= */}

          <div style={styles.grid}>
            {visibleApplications.map(
              (app) => (
                <div
                  key={app.name}
                  style={{
                    ...styles.appCard,
                    borderTop: `5px solid ${app.color}`,
                  }}
                >
                  <div
                    style={{
                      ...styles.appIcon,
                      background:
                        app.color,
                    }}
                  >
                    {app.name
                      .replace(
                        "Zoho ",
                        ""
                      )
                      .charAt(0)}
                  </div>

                  <h2
                    style={
                      styles.appTitle
                    }
                  >
                    {app.name}
                  </h2>

                  <p
                    style={
                      styles.description
                    }
                  >
                    {app.description}
                  </p>

                  <button
                    onClick={() =>
                      window.open(
                        app.url,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    style={{
                      ...styles.openButton,
                      background:
                        app.color,
                    }}
                  >
                    Open Application →
                  </button>
                </div>
              )
            )}
          </div>

          {/* =========================
              ADMIN PANEL
          ========================= */}

          {user.role === "Admin" && (
            <div
              style={
                styles.adminPanel
              }
            >
              <h2>
                Administration
              </h2>

              <p>
                Manage users, roles,
                permissions and audit
                logs.
              </p>

              <div
                style={
                  styles.adminButtons
                }
              >
                <button
                  style={
                    styles.adminButton
                  }
                  onClick={
                    handleManageUsers
                  }
                >
                  Manage Users
                </button>

                <button
                  style={
                    styles.adminButton
                  }
                >
                  Manage Roles
                </button>

                <button
                  style={
                    styles.adminButton
                  }
                >
                  Manage Permissions
                </button>

                <button
                  style={
                    styles.adminButton
                  }
                  onClick={
                    handleAuditLogs
                  }
                >
                  View Audit Logs
                </button>
              </div>
            </div>
          )}

          {/* =========================
              MANAGE USERS
          ========================= */}

          {showUsers && (
            <div
              style={
                styles.usersPanel
              }
            >
              <div
                style={
                  styles.usersHeader
                }
              >
                <div>
                  <h2
                    style={
                      styles.usersTitle
                    }
                  >
                    Manage Users
                  </h2>

                  <p
                    style={
                      styles.usersSubtitle
                    }
                  >
                    Create and manage
                    employee accounts
                  </p>
                </div>

                <button
                  style={
                    styles.closeButton
                  }
                  onClick={() => {
                    setShowUsers(
                      false
                    );
                    setShowAddUser(
                      false
                    );
                    setUserMessage(
                      ""
                    );
                  }}
                >
                  Close
                </button>
              </div>

              {/* ADD USER */}

              <div
                style={
                  styles.userActions
                }
              >
                <button
                  style={
                    styles.addUserButton
                  }
                  onClick={() => {
                    setShowAddUser(
                      true
                    );

                    setUserMessage(
                      ""
                    );
                  }}
                >
                  + Add User
                </button>
              </div>

              {/* MESSAGE */}

              {userMessage && (
                <p
                  style={
                    styles.userMessage
                  }
                >
                  {userMessage}
                </p>
              )}

              {/* USERS TABLE */}

              {loadingUsers ? (
                <p
                  style={
                    styles.loadingText
                  }
                >
                  Loading users...
                </p>
              ) : users.length === 0 ? (
                <p
                  style={
                    styles.loadingText
                  }
                >
                  No users found.
                </p>
              ) : (
                <div
                  style={
                    styles.tableContainer
                  }
                >
                  <table
                    style={
                      styles.table
                    }
                  >
                    <thead>
                      <tr>
                        <th
                          style={
                            styles.th
                          }
                        >
                          Name
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Email
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Role
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Status
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map(
                        (employee) => (
                          <tr
                            key={
                              employee.id
                            }
                          >
                            <td
                              style={
                                styles.td
                              }
                            >
                              {
                                employee.name
                              }
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {
                                employee.email
                              }
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              <select
                                value={
                                  employee.role ||
                                  ""
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleRoleChange(
                                    employee.id,
                                    e
                                      .target
                                      .value
                                  )
                                }
                                style={
                                  styles.roleSelect
                                }
                              >
                                {roles.map(
                                  (
                                    role
                                  ) => (
                                    <option
                                      key={
                                        role
                                      }
                                      value={
                                        role
                                      }
                                    >
                                      {
                                        role
                                      }
                                    </option>
                                  )
                                )}
                              </select>
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              <span
                                style={
                                  employee.is_active
                                    ? styles.activeBadge
                                    : styles.inactiveBadge
                                }
                              >
                                {employee.is_active
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              <button
                                style={
                                  employee.is_active
                                    ? styles.deactivateButton
                                    : styles.activateButton
                                }
                                onClick={() =>
                                  handleStatusChange(
                                    employee.id,
                                    !employee.is_active
                                  )
                                }
                                disabled={
                                  employee.id ===
                                  user.id
                                }
                              >
                                {employee.is_active
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* =========================
                  ADD USER MODAL
              ========================= */}

              {showAddUser && (
                <div
                  style={
                    styles.modalOverlay
                  }
                >
                  <div
                    style={
                      styles.modal
                    }
                  >
                    <h2
                      style={
                        styles.modalTitle
                      }
                    >
                      Add New Employee
                    </h2>

                    <p
                      style={
                        styles.modalSubtitle
                      }
                    >
                      Create an employee
                      portal account
                    </p>

                    <form
                      onSubmit={
                        handleCreateUser
                      }
                    >
                      {/* NAME */}

                      <label
                        style={
                          styles.label
                        }
                      >
                        Name
                      </label>

                      <input
                        style={
                          styles.input
                        }
                        type="text"
                        placeholder="Enter employee name"
                        value={
                          newUser.name
                        }
                        onChange={(
                          e
                        ) =>
                          setNewUser({
                            ...newUser,
                            name: e
                              .target
                              .value,
                          })
                        }
                        required
                      />

                      {/* EMAIL */}

                      <label
                        style={
                          styles.label
                        }
                      >
                        Email
                      </label>

                      <input
                        style={
                          styles.input
                        }
                        type="email"
                        placeholder="Enter employee email"
                        value={
                          newUser.email
                        }
                        onChange={(
                          e
                        ) =>
                          setNewUser({
                            ...newUser,
                            email: e
                              .target
                              .value,
                          })
                        }
                        required
                      />

                      {/* PASSWORD */}

                      <label
                        style={
                          styles.label
                        }
                      >
                        Password
                      </label>

                      <input
                        style={
                          styles.input
                        }
                        type="password"
                        placeholder="Enter temporary password"
                        value={
                          newUser.password
                        }
                        onChange={(
                          e
                        ) =>
                          setNewUser({
                            ...newUser,
                            password: e
                              .target
                              .value,
                          })
                        }
                        required
                      />

                      {/* ROLE */}

                      <label
                        style={
                          styles.label
                        }
                      >
                        Role
                      </label>

                      <select
                        style={
                          styles.input
                        }
                        value={
                          newUser.role
                        }
                        onChange={(
                          e
                        ) =>
                          setNewUser({
                            ...newUser,
                            role: e
                              .target
                              .value,
                          })
                        }
                      >
                        {roles.map(
                          (role) => (
                            <option
                              key={
                                role
                              }
                              value={
                                role
                              }
                            >
                              {role}
                            </option>
                          )
                        )}
                      </select>

                      {/* BUTTONS */}

                      <div
                        style={
                          styles.modalButtons
                        }
                      >
                        <button
                          type="button"
                          style={
                            styles.cancelButton
                          }
                          onClick={() =>
                            setShowAddUser(
                              false
                            )
                          }
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          style={
                            styles.createButton
                          }
                        >
                          Create User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================
              AUDIT LOGS
          ========================= */}

          {showAuditLogs && (
            <div
              style={
                styles.auditPanel
              }
            >
              <div
                style={
                  styles.auditHeader
                }
              >
                <div>
                  <h2
                    style={
                      styles.auditTitle
                    }
                  >
                    Audit Logs
                  </h2>

                  <p
                    style={
                      styles.auditSubtitle
                    }
                  >
                    Monitor important
                    system activities
                  </p>
                </div>

                <button
                  style={
                    styles.closeButton
                  }
                  onClick={() => {
                    setShowAuditLogs(
                      false
                    );

                    setAuditMessage(
                      ""
                    );
                  }}
                >
                  Close
                </button>
              </div>

              {auditMessage && (
                <p
                  style={
                    styles.userMessage
                  }
                >
                  {auditMessage}
                </p>
              )}

              {loadingLogs ? (
                <p
                  style={
                    styles.loadingText
                  }
                >
                  Loading audit logs...
                </p>
              ) : auditLogs.length ===
                0 ? (
                <p
                  style={
                    styles.loadingText
                  }
                >
                  No audit logs found.
                </p>
              ) : (
                <div
                  style={
                    styles.tableContainer
                  }
                >
                  <table
                    style={
                      styles.table
                    }
                  >
                    <thead>
                      <tr>
                        <th
                          style={
                            styles.th
                          }
                        >
                          Action
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Performed By
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Resource
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Details
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Time
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {auditLogs.map(
                        (log) => (
                          <tr
                            key={
                              log.id
                            }
                          >
                            <td
                              style={
                                styles.td
                              }
                            >
                              <span
                                style={
                                  styles.actionBadge
                                }
                              >
                                {
                                  log.action
                                }
                              </span>
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              <strong>
                                {
                                  log.user_name ||
                                  "System"
                                }
                              </strong>

                              <div
                                style={
                                  styles.smallText
                                }
                              >
                                {
                                  log.user_email ||
                                  "-"
                                }
                              </div>
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {
                                log.resource ||
                                "-"
                              }
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {log.metadata
                                ? Object.entries(
                                    log.metadata
                                  )
                                    .map(
                                      ([
                                        key,
                                        value,
                                      ]) =>
                                        `${key}: ${value}`
                                    )
                                    .join(
                                      ", "
                                    )
                                : "-"}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {new Date(
                                log.created_at
                              ).toLocaleString()}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.loginIcon}>
          EP
        </div>

        <h1 style={styles.title}>
          Employee Portal
        </h1>

        <p style={styles.subtitle}>
          Sign in to access your
          authorized applications
        </p>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={styles.input}
            required
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={styles.loginButton}
          >
            Login
          </button>
        </form>

        {message && (
          <p style={styles.error}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================

const styles = {
  // LOGIN

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e2e8f0",
    padding: "20px",
  },

  card: {
    width: "400px",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.15)",
  },

  loginIcon: {
    width: "60px",
    height: "60px",
    margin: "0 auto 20px",
    borderRadius: "14px",
    background: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },

  title: {
    textAlign: "center",
    margin: "0 0 12px 0",
    color: "#0f172a",
    fontSize: "46px",
    lineHeight: "1.2",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    margin: "0 0 35px 0",
    fontSize: "16px",
    lineHeight: "1.5",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "20px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "15px",
  },

  loginButton: {
    width: "100%",
    padding: "13px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    textAlign: "center",
    color: "#dc2626",
    marginTop: "20px",
  },

  // DASHBOARD

  dashboard: {
    minHeight: "100vh",
    background: "#f1f5f9",
  },

  header: {
    background: "#0f172a",
    color: "white",
    padding: "22px 45px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 4px 15px rgba(15, 23, 42, 0.2)",
  },

  headerTitle: {
    margin: 0,
    fontSize: "30px",
  },

  headerSubtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  role: {
    color: "#60a5fa",
    marginTop: "4px",
  },

  logoutButton: {
    padding: "10px 18px",
    border: "1px solid #475569",
    borderRadius: "8px",
    background: "#1e293b",
    color: "white",
    cursor: "pointer",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "45px 25px",
  },

  welcome: {
    marginBottom: "35px",
    color: "#0f172a",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
  },

  appCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "14px",
    boxShadow:
      "0 5px 20px rgba(15, 23, 42, 0.08)",
    borderLeft:
      "1px solid #e2e8f0",
    borderRight:
      "1px solid #e2e8f0",
    borderBottom:
      "1px solid #e2e8f0",
  },

  appIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },

  appTitle: {
    color: "#0f172a",
    marginBottom: "10px",
  },

  description: {
    color: "#64748b",
    minHeight: "45px",
  },

  openButton: {
    width: "100%",
    padding: "12px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  // ADMIN

  adminPanel: {
    marginTop: "35px",
    background: "#ffffff",
    padding: "28px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 5px 20px rgba(15, 23, 42, 0.06)",
  },

  adminButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  adminButton: {
    padding: "11px 17px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#f8fafc",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "500",
  },

  // USERS

  usersPanel: {
    marginTop: "30px",
    background: "#ffffff",
    padding: "28px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 5px 20px rgba(15, 23, 42, 0.06)",
  },

  usersHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  usersTitle: {
    margin: 0,
    color: "#0f172a",
  },

  usersSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
  },

  closeButton: {
    padding: "9px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#f8fafc",
    cursor: "pointer",
  },

  userActions: {
    marginBottom: "20px",
  },

  addUserButton: {
    padding: "11px 18px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  userMessage: {
    padding: "10px",
    background: "#f1f5f9",
    borderRadius: "8px",
    color: "#334155",
  },

  loadingText: {
    color: "#64748b",
    padding: "20px 0",
  },

  tableContainer: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    background: "#f8fafc",
    color: "#475569",
    borderBottom:
      "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px",
    borderBottom:
      "1px solid #e2e8f0",
    color: "#334155",
    verticalAlign: "middle",
  },

  roleSelect: {
    padding: "7px 10px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#334155",
    cursor: "pointer",
  },

  roleBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "600",
  },

  activeBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: "600",
  },

  inactiveBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "600",
  },

  activateButton: {
    padding: "7px 12px",
    border: "none",
    borderRadius: "7px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  deactivateButton: {
    padding: "7px 12px",
    border: "none",
    borderRadius: "7px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  // MODAL

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "rgba(15, 23, 42, 0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    width: "420px",
    maxWidth: "90%",
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    boxShadow:
      "0 20px 50px rgba(0, 0, 0, 0.2)",
  },

  modalTitle: {
    margin: "0 0 6px",
    color: "#0f172a",
  },

  modalSubtitle: {
    margin: "0 0 25px",
    color: "#64748b",
  },

  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },

  cancelButton: {
    padding: "11px 17px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#f8fafc",
    cursor: "pointer",
  },

  createButton: {
    padding: "11px 17px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  // AUDIT LOGS

  auditPanel: {
    marginTop: "30px",
    background: "#ffffff",
    padding: "28px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 5px 20px rgba(15, 23, 42, 0.06)",
  },

  auditHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  auditTitle: {
    margin: 0,
    color: "#0f172a",
  },

  auditSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
  },

  actionBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "6px",
    background: "#ede9fe",
    color: "#6d28d9",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  smallText: {
    marginTop: "4px",
    color: "#64748b",
    fontSize: "12px",
  },
};

export default App;