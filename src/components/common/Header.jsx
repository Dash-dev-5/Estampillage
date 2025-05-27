import { Search, Bell, Gear } from "react-bootstrap-icons"
import { useSelector } from "react-redux"
import ThemeToggle from "./ThemeToggle"
import NotificationDropdown from "./NotificationDropdown"

const Header = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-action d-md-none" onClick={() => setSidebarOpen(!sidebarOpen)} title="Menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* <div className="app-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          ESTAMPILLAGE
        </div> */}

        <div className="header-search">
          <Search className="search-icon" size={16} />
          <input type="search" placeholder="Rechercher dans le système..." className="search-input" />
        </div>
      </div>

      <div className="header-right">
      <NotificationDropdown />

        <ThemeToggle />

        <button className="header-action" title="Paramètres">
          <Gear size={18} />
        </button>

        <div className="user-profile">
          <div className="user-avatar">{user?.username?.charAt(0).toUpperCase() || "A"}</div>
          <div className="user-info">
            <div className="user-name">{user?.username || "Utilisateur"}</div>
            <div className="user-role">
              {user?.role === "admin" && "Administrateur"}
              {user?.role === "dg" && "Direction Générale"}
              {user?.role === "opg" && "OPG"}
              {user?.role === "industry_agent" && "Agent Industrie"}
              {!user?.role && "Rôle"}
            </div>
          </div>
        </div>
      </div>
    </header> 
  )

  // return (
  //   <header className="app-header">
  //     <div className="app-logo">
  //       <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  //         <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  //       </svg>
  //       {import.meta.env.VITE_APP_NAME || "ESTAMPILLAGE"}
  //     </div>

  //     <div className="header-search">
  //       <Search className="search-icon" size={16} />
  //       <input type="search" placeholder="Rechercher dans le système..." className="search-input" />
  //     </div>

  //     <div className="header-actions">
  //       <NotificationDropdown />
  //       <ThemeToggle />

  //       <button className="header-action" title="Paramètres">
  //         <Gear size={18} />
  //       </button>

  //       <div className="user-profile">
  //         <div className="user-avatar">{user?.username?.charAt(0).toUpperCase() || "U"}</div>
  //         <div className="user-info">
  //           <div className="user-name">{user?.username || "Utilisateur"}</div>
  //           <div className="user-role">
  //             {user?.role === "admin" && "Administrateur"}
  //             {user?.role === "dg" && "Direction Générale"}
  //             {user?.role === "opg" && "OPG"}
  //             {user?.role === "industry_agent" && "Agent Industrie"}
  //             {!user?.role && "Rôle"}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </header>
  // )
}

export default Header
