import { useAuth0 } from '@auth0/auth0-react';

function Navbar() {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();

  return (
    <header className="navbar">
      <div className="nav-brand">
        <span className="nav-icon">⛅</span>
        <span className="nav-title">WeatherComfort</span>
        <span className="nav-sub">by Fidenz</span>
      </div>

      <nav className="nav-actions">
        {isAuthenticated ? (
          <>
            <div className="nav-user">
              <span className="user-dot" />
              <span className="user-email">{user?.email}</span>
            </div>
            <button
              className="btn btn-outline"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Sign Out
            </button>
          </>
        ) : (
          !isLoading && (
            <button
              className="btn btn-primary"
              onClick={() => loginWithRedirect()}
            >
              Sign In
            </button>
          )
        )}
      </nav>
    </header>
  );
}

export default Navbar;
