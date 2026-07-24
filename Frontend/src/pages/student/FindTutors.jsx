import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import TutorFilters from "../../components/tutor/TutorFilters";
import TutorCard from "../../components/tutor/TutorCard";
import EmptyState from "../../components/dashboard/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { getTutors } from "../../api/studentApi";
import { toggleFavoriteTutor, getFavoriteIds } from "../../api/featureApi";

function FindTutors() {
  const [tutors, setTutors] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const initialFilters = {
    subject: "",
    minRating: "",
    experience: "",
    maxPrice: "",
    day: "",
    language: "",
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    fetchTutorsAndFavorites();
  }, [filters, search]);

  const fetchTutorsAndFavorites = async () => {
    try {
      setLoading(true);
      const queryParams = { ...filters, search: search.trim() };
      const data = await getTutors(queryParams);
      setTutors(data.tutors || []);

      const favData = await getFavoriteIds();
      setFavoriteIds(favData.favoriteIds || []);
    } catch (error) {
      console.error("Failed to load tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (tutorUserId) => {
    try {
      const res = await toggleFavoriteTutor(tutorUserId);
      if (res.isFavorite) {
        setFavoriteIds((prev) => [...prev, tutorUserId]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== tutorUserId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const allSubjects = [...new Set(tutors.flatMap((t) => t.subjects || []))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Find Peer Tutors
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Search, filter, and book 1-on-1 tutoring sessions with top verified tutors.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by tutor name, subject, bio, or qualifications..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Advanced Multi-Criteria Filter */}
      <TutorFilters
        filters={filters}
        setFilters={setFilters}
        subjects={allSubjects}
        onReset={() => {
          setFilters(initialFilters);
          setSearch("");
        }}
      />

      {/* Tutor Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : tutors.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Tutors Found"
          description="We couldn't find any tutors matching your filter criteria. Try adjusting your search query or subject filters."
          buttonText="Reset All Filters"
          onButtonClick={() => {
            setFilters(initialFilters);
            setSearch("");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <TutorCard
              key={tutor._id}
              tutor={tutor}
              isFavorite={tutor.user && favoriteIds.includes(tutor.user._id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FindTutors;