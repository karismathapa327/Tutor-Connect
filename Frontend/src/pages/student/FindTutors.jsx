import { useEffect, useState } from "react";

import TutorSearch from "../../components/tutor/TutorSearch";
import TutorFilters from "../../components/tutor/TutorFilters";
import TutorGrid from "../../components/tutor/TutorGrid";

import { getTutors } from "../../api/studentApi";

function FindTutors() {

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {

    fetchTutors();

  }, []);

  const fetchTutors = async () => {

    try {

      const data = await getTutors();

    //   console.log(data);

      setTutors(data.tutors);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to load tutors."
    );

    } finally {

      setLoading(false);

    }

  };

    const filteredTutors = tutors.filter((tutor) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        tutor.user.name.toLowerCase().includes(keyword) ||
        tutor.bio.toLowerCase().includes(keyword) ||
        tutor.subjects.some((subject) =>
          subject.toLowerCase().includes(keyword)
        );

      const matchesSubject =
        selectedSubject === "" ||
        tutor.subjects.includes(selectedSubject);

      return matchesSearch && matchesSubject;
    });

    const subjects = [
      ...new Set(
        tutors.flatMap((tutor) => tutor.subjects)
      ),
    ];

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Find Tutors
        </h1>

        <p className="text-gray-500 mt-2">
          Discover experienced tutors and send learning requests.
        </p>

      </div>

        <TutorSearch
          search={search}
          setSearch={setSearch}
        />

      <TutorFilters
        subjects={subjects}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />

      <TutorGrid
          tutors={filteredTutors}
          loading={loading}
        />
 </div>

 

  );

}

export default FindTutors;