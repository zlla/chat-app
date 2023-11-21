import ListCourses from "./ListCourses";

const RegisteredCourses = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Registered Courses</h1>
      <ListCourses status="active" />
    </div>
  );
};

export default RegisteredCourses;
