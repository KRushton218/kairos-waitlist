import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold text-gray-800">Kairos</Link>
      </div>
    </nav>
  );
}
