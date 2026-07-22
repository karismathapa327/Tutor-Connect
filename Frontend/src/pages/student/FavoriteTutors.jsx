import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import TutorCard from "../../components/tutor/TutorCard";
import EmptyState from "../../components/dashboard/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { getFavoriteTutors, toggleFavoriteTutor } from "../../api/featureApi";

function FavoriteTutors() {
  const [favoriteTutors, setFavoriteTutors] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavoriteTutors();
      setFavoriteTutors(data.tutors || []);
      setFavoriteIds(data.favoriteTutorIds || []);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (tutorUserId) => {
    try {
      await toggleFavoriteTutor(tutorUserId);
      setFavoriteTutors((prev) => prev.filter((t) => t.user && t.user._id !== tutorUserId));
      setFavoriteIds((prev) => prev.filter((id) => id !== tutorUserId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Heart className="text-rose-500 fill-rose-500" size={28} /> Saved Favorite Tutors
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Quickly access and book sessions with your bookmarked tutors.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : favoriteTutors.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Favorite Tutors Saved"
          description="You haven't saved any tutors yet. Click the heart icon on any tutor card to save them to your favorites list!"
          buttonText="Explore Tutors"
          buttonLink="/student/tutors"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteTutors.map((tutor) => (
            <TutorCard
              key={tutor._id}
              tutor={tutor}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteTutors;
