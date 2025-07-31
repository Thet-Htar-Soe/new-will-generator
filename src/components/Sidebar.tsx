import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();

  return (
    <div className="w-48 bg-black text-white min-h-screen p-4 border-e-1 border-e-amber-600">
      <ul className="space-y-2">
        <li className="border-b-1 border-b-amber-600">
          <Link
            to="/"
            className={`block px-3 py-2 rounded hover:bg-gray-700 ${location.pathname === "/" ? "text-amber-400" : ""}`}
          >
            Data Gathering
          </Link>
        </li>
        <li className="border-b-1 border-b-amber-600">
          <Link
            to="/selection"
            className={`block px-3 py-2 rounded hover:bg-gray-700 ${
              location.pathname === "/selection" || location.pathname === "/diagram" ? "text-amber-400" : ""
            }`}
          >
            Data Analysis
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
