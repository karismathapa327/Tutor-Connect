import { Search } from "lucide-react";

function TutorSearch({ search, setSearch }) {
  return (
    <div className="relative">

      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by tutor name, subject or bio..."
        className="w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
}

export default TutorSearch;