import { useAuth } from "../contexts/AuthContext";
import "./LogoutButton.css";

export function LogoutButton() {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <button type="button" className="logoutButton" onClick={handleLogout}>
      Log out
    </button>
  );
}
