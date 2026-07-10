import { useEffect, useState } from "react";
import {
  Loader2,
  MessageSquare,
  Search,
  Star,
} from "lucide-react";

import { getTutorReviews } from "../../api/tutorApi";

function TutorReviews() {

  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {

    const filtered = reviews.filter((review) =>
      review.student?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      review.review
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredReviews(filtered);

  }, [search, reviews]);

  const fetchReviews = async () => {

    try {

      setLoading(true);

      const data = await getTutorReviews();

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

      <div className="flex gap-1 justify-center">

        {[1,2,3,4,5].map((star)=>(

          <Star
            key={star}
            size={16}
            className={
              star<=rating
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
          size={45}
          className="animate-spin text-blue-600"
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

        <p className="mt-2">

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

            My Reviews

          </h1>

          <p className="text-gray-500 mt-2">

            Total Reviews : {reviews.length}

          </p>

        </div>

      </div>

      {/* Search */}

      <div className="relative mb-6">

        <Search
          size={20}
          className="absolute left-4 top-3.5 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search reviews..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

      {/* Empty */}

      {filteredReviews.length===0 ? (

        <div className="bg-white rounded-xl shadow p-12 text-center">

          <MessageSquare
            size={70}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-bold mt-4">

            No Reviews Yet

          </h2>

          <p className="text-gray-500 mt-2">

            Students haven't reviewed you yet.

          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {filteredReviews.map((review)=>(

            <div
              key={review._id}
              className="bg-white rounded-xl shadow p-6"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="font-bold text-lg">

                    {review.student?.name}

                  </h3>

                  <p className="text-gray-500 text-sm">

                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}

                  </p>

                </div>

                {renderStars(review.rating)}

              </div>

              <p className="mt-4 text-gray-700">

                {review.review}

              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default TutorReviews;