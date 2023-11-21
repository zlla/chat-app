import ListCourses from "./ListCourses";

const PlannedCourses = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Planned Courses</h1>
      <ListCourses status="pending" />
    </div>
  );
};

export default PlannedCourses;
