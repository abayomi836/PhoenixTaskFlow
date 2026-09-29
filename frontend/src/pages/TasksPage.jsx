import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TaskCard from "../components/TaskCard";
import TaskTable from "../components/TaskTable";

import {
  deleteTask,
  getTasks,
  updateTaskStatus,
} from "../services/taskService";

const DEMO_MANAGER = {
  _id: "mock-manager-1",
  name: "Jane Manager",
  email: "jane@example.com",
  role: "manager",
  position: "Head of Department",
  department: {
    _id: "mock-department-1",
    name: "Academic",
  },
};

const getId = (value) =>
  typeof value === "string" ? value : value?._id;

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : "Something went wrong.";

function TasksPage({
  currentUser = DEMO_MANAGER,
}) {
  const navigate = useNavigate();

  const role = currentUser?.role;
  const canManage =
    role === "admin" || role === "manager";

  const [tasks, setTasks] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);
  const [view, setView] = useState("table");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const filters = {
          search,
          status,
          priority,
          page,
          limit: pagination.limit,
        };

        /*
         * These filters are only being used by the local mock service
         * during independent frontend testing.
         *
         * When the real API is connected, the backend will determine
         * employee/manager task scope from the authenticated JWT.
         */
        if (role === "manager") {
          filters.department = getId(
            currentUser?.department,
          );
        }

        if (role === "employee") {
          filters.assignedTo = currentUser?._id;
        }

        const result = await getTasks(filters);

        if (active) {
          setTasks(result.tasks);
          setPagination(result.pagination);
        }
      } catch (loadError) {
        if (active) {
          setError(
            getErrorMessage(loadError),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      active = false;
    };
  }, [
    currentUser?._id,
    currentUser?.department,
    page,
    pagination.limit,
    priority,
    refreshKey,
    role,
    search,
    status,
  ]);

  const resetPageAndSet = (
    setter,
    value,
  ) => {
    setter(value);
    setPage(1);
  };

  const showTask = (task) => {
    navigate(`/tasks/${task._id}`);
  };

  const editTask = (task) => {
    navigate(`/tasks/${task._id}/edit`);
  };

  const createTask = () => {
    navigate("/tasks/create");
  };

  const handleDelete = async (task) => {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setNotice("");

    try {
      const deleted = await deleteTask(task._id);

      if (!deleted) {
        throw new Error("Task could not be deleted.");
      }

      setNotice("Task deleted.");
      setRefreshKey((key) => key + 1);
    } catch (deleteError) {
      setError(
        getErrorMessage(deleteError),
      );
    }
  };

  const handleStatusChange = async (
    taskId,
    nextStatus,
  ) => {
    setError("");
    setNotice("");

    try {
      const updatedTask =
        await updateTaskStatus(
          taskId,
          nextStatus,
        );

      if (!updatedTask) {
        throw new Error(
          "Task could not be updated.",
        );
      }

      setNotice(
        "Task status updated.",
      );

      setRefreshKey((key) => key + 1);
    } catch (statusError) {
      setError(
        getErrorMessage(statusError),
      );
    }
  };

  return (
    <main
      style={{
        margin: "0 auto",
        maxWidth: "1200px",
        padding: "2rem 1rem",
      }}
    >
      <header
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            Tasks
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: 0,
            }}
          >
            {role === "employee"
              ? "View and update the tasks assigned to you."
              : "Search, review, and manage tasks."}
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={createTask}
          >
            Create task
          </button>
        )}
      </header>

      <p
        role="status"
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "0.75rem 1rem",
        }}
      
      >
        {role === "employee"
          ? "You can only view and update the status of tasks assigned to you."
          : "You can view, create, edit, and delete tasks."}
      </p>

      <section
        aria-label="Task filters"
        style={{
          alignItems: "end",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1rem",
          padding: "1rem",
        }}
      >
        <label
          style={{
            display: "grid",
            gap: "0.3rem",
            flex: "1 1 220px",
          }}
        >
          Search tasks

          <input
            type="search"
            value={search}
            onChange={(event) =>
              resetPageAndSet(
                setSearch,
                event.target.value,
              )
            }
            placeholder="Search title, description..."
          />
        </label>

        <label
          style={{
            display: "grid",
            gap: "0.3rem",
          }}
        >
          Status

          <select
            value={status}
            onChange={(event) =>
              resetPageAndSet(
                setStatus,
                event.target.value,
              )
            }
          >
            <option value="">
              All statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="in-progress">
              In progress
            </option>

            <option value="completed">
              Completed
            </option>
          </select>
        </label>

        <label
          style={{
            display: "grid",
            gap: "0.3rem",
          }}
        >
          Priority

          <select
            value={priority}
            onChange={(event) =>
              resetPageAndSet(
                setPriority,
                event.target.value,
              )
            }
          >
            <option value="">
              All priorities
            </option>

            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>
        </label>

        <label
          style={{
            display: "grid",
            gap: "0.3rem",
          }}
        >
          Rows per page

          <select
            value={pagination.limit}
            onChange={(event) => {
              setPagination((current) => ({
                ...current,
                limit: Number(
                  event.target.value,
                ),
              }));

              setPage(1);
            }}
          >
            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>
          </select>
        </label>

        <div
          aria-label="Task display mode"
          style={{
            display: "flex",
            gap: "0.4rem",
          }}
        >
          <button
            type="button"
            aria-pressed={
              view === "table"
            }
            onClick={() =>
              setView("table")
            }
          >
            Table
          </button>

          <button
            type="button"
            aria-pressed={
              view === "cards"
            }
            onClick={() =>
              setView("cards")
            }
          >
            Cards
          </button>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          style={{
            color: "#b42318",
          }}
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          role="status"
          style={{
            color: "#176b35",
          }}
        >
          {notice}
        </p>
      )}

      {loading ? (
        <p
          role="status"
          aria-live="polite"
        >
          Loading tasks…
        </p>
      ) : view === "table" ? (
        <TaskTable
          tasks={tasks}
          onView={showTask}
          onEdit={
            canManage
              ? editTask
              : undefined
          }
          onDelete={
            canManage
              ? handleDelete
              : undefined
          }
          onStatusChange={
            role === "employee"
              ? handleStatusChange
              : undefined
          }
          canManage={canManage}
          canUpdateStatus={
            role === "employee"
          }
        />
      ) : (
        <div
          aria-label="Tasks"
          style={{
            display: "grid",
            gap: "1rem",
          }}
        >
          {tasks.length === 0 ? (
            <p>
              No tasks found.
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onView={showTask}
                onEdit={
                  canManage
                    ? editTask
                    : undefined
                }
                onDelete={
                  canManage
                    ? handleDelete
                    : undefined
                }
                onStatusChange={
                  role === "employee"
                    ? handleStatusChange
                    : undefined
                }
                canManage={canManage}
                canUpdateStatus={
                  role === "employee"
                }
              />
            ))
          )}
        </div>
      )}

      <nav
        aria-label="Task list pages"
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <span>
          Page {pagination.page} of{" "}
          {pagination.totalPages} ·{" "}
          {pagination.total} task
          {pagination.total === 1
            ? ""
            : "s"}
        </span>

        <button
          type="button"
          onClick={() =>
            setPage((current) =>
              Math.max(
                1,
                current - 1,
              ),
            )
          }
          disabled={
            loading ||
            pagination.page <= 1
          }
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() =>
            setPage((current) =>
              Math.min(
                pagination.totalPages,
                current + 1,
              ),
            )
          }
          disabled={
            loading ||
            pagination.page >=
              pagination.totalPages
          }
        >
          Next
        </button>
      </nav>
    </main>
  );
}

export default TasksPage;