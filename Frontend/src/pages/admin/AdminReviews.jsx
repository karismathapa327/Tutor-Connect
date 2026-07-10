import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  MessageSquare,
  Star,
} from "lucide-react";

import { getReviews } from "../../api/adminApi";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const filtered = reviews.filter((review) => {
      return (
        review.student?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        review.tutor?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        review.review
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });

    setFilteredReviews(filtered);
  }, [search, reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await getReviews();

      setReviews(data.reviews);
      setFilteredReviews(data.reviews);

    } catch (err) {

      console.error(err);
      setError("Failed to load reviews.");

    } finally {

      setLoading(false);

    }
  };

  const renderStars = (rating) => {

    return (

      <div className="flex justify-center gap-1">

        {[1,2,3,4,5].map((star) => (

          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />

        ))}

      </div>

    );

  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2
          className="animate-spin text-blue-600"
          size={45}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">

        <h2 className="text-2xl font-bold text-red-600">
          Something went wrong
        </h2>

        <p className="mt-3">
          {error}
        </p>

        <button
          onClick={fetchReviews}
          className="mt-5 bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Try Again
        </button>

      </div>
    );
  }

  return (

    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Reviews
          </h1>

          <p className="text-gray-500 mt-2">
            Total Reviews : {reviews.length}
          </p>

        </div>

      </div>

      {/* Search */}

      <div className="relative mb-6">

        <Search
          className="absolute left-4 top-3.5 text-gray-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search reviews..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* Empty State */}

      {filteredReviews.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-12 text-center">

          <MessageSquare
            size={70}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-bold mt-4">
            No Reviews Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try another search.
          </p>

        </div>

      ) : (

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="text-left p-4">
                  Student
                </th>

                <th className="text-left p-4">
                  Tutor
                </th>

                <th className="text-center p-4">
                  Rating
                </th>

                <th className="text-left p-4">
                  Review
                </th>

                <th className="text-center p-4">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReviews.map((review) => (

                <tr
                  key={review._id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-4">
                    {review.student?.name}
                  </td>

                  <td className="p-4">
                    {review.tutor?.name}
                  </td>

                  <td className="p-4 text-center">
                    {renderStars(review.rating)}
                  </td>

                  <td className="p-4 max-w-sm">
                    {review.review}
                  </td>

                  <td className="p-4 text-center">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}

export default AdminReviews;