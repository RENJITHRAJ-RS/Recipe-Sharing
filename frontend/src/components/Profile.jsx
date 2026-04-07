import "./Profile.css";
import UserNavbar from "./UserNavbar";

export default function Profile() {
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile updated (UI only)");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert("Password changed (UI only)");
  };

  return (
    <>
      {/* USER NAVBAR */}
      <UserNavbar />

      <div className="profile-page">
        <h2>My Profile</h2>

        {/* PROFILE INFO */}
        <div className="profile-card">
          <img
            src="https://i.pravatar.cc/150"
            alt="Profile"
            className="profile-img"
          />

          <form onSubmit={handleProfileUpdate} className="profile-form">
            <label>Name</label>
            <input type="text" defaultValue="Renjith Raj" />

            <label>Email</label>
            <input type="email" defaultValue="renjith@gmail.com" />

            <label>Change Profile Photo</label>
            <input type="file" accept="image/*" />

            <button type="submit">Update Profile</button>
          </form>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="password-card">
          <h3>Change Password</h3>

          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              placeholder="Current Password"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              required
            />

            <button type="submit">Update Password</button>
          </form>
        </div>
      </div>
    </>
  );
}
