// TEMP: using mock auth until Member 2's real AuthContext is ready.
// Swap this back to: import { useAuth } from "../context/AuthContext";
import { useAuth } from "../services/mocks/mockUseAuth";
import "./Profile.css";

// Profile — read-only view of the logged-in user's own info (Member 4 scope)
//
// Deliberately doesn't make its own API call — it just reads from the
// auth context, since that already holds the authenticated user (from
// GET /api/auth/me at login, per the contract). No separate
// /users/:id lookup needed for viewing your own profile.
//
// No edit form here: the role doc's Profile bullet only says "Profile
// page/interface" (view), not "edit profile" — if the team wants
// self-service profile editing later, that's a scope addition, not
// something assumed here.

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile">
        <div className="profile__state">Couldn't load your profile.</div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile__card">
        <div className="profile__avatar">{initials(user.name)}</div>

        <div className="profile__identity">
          <h1>{user.name}</h1>
          <span className="profile__role">{user.role}</span>
        </div>

        <dl className="profile__details">
          <dt>Email</dt>
          <dd>{user.email}</dd>

          <dt>Position</dt>
          <dd>{user.position || "—"}</dd>

          <dt>Department</dt>
          <dd>{user.department?.name || "—"}</dd>

          <dt>Status</dt>
          <dd>
            <span
              className={`profile__status profile__status--${
                user.isActive ? "active" : "inactive"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </dd>
        </dl>
      </div>
    </div>
  );
}
