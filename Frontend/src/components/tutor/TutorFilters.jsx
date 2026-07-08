function TutorFilters({
  subjects,
  selectedSubject,
  setSelectedSubject,
}) {
  return (
    <div className="flex gap-4">

      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="border rounded-lg px-4 py-2"
      >
        <option value="">All Subjects</option>

        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}

      </select>

    </div>
  );
}

export default TutorFilters;