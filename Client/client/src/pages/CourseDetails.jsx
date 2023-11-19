import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiUrl } from "../support/axios_setting";
import axios from "axios";
import { IoMdPersonAdd } from "react-icons/io";

const CourseDetails = () => {
  const { state } = useLocation();
  const { linkImage } = state;

  const { courseId } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios(`${apiUrl}/api/courses/all/${courseId}`);
        const data = await response.data;
        setDetails(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="display-4">{details.educationalCourseDTO.courseName}</h1>
      <p className="lead">{details.educationalCourseDTO.description}</p>
      <div className="row">
        <div className="col-md-6">
          <img src={linkImage} alt="courseImage" />
          <p className="fw-bold">
            Instructor: {details.educationalCourseDTO.instructor}
          </p>
          <p className="fw-bold">
            Duration: {details.educationalCourseDTO.duration}
          </p>
          <p className="fw-bold">
            Start Date: {details.educationalCourseDTO.startDate}
          </p>
          <p className="fw-bold">
            End Date: {details.educationalCourseDTO.endDate}
          </p>
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">Users in Class:</h2>
          <ul className="list-group">
            {details.usersInClass.map((user) => (
              <li
                key={user.id}
                className="list-group-item d-flex justify-content-between"
              >
                <div>
                  <p className="mb-1">ID: {user.id}</p>
                  <p className="mb-1">Username: {user.username}</p>
                  <p>Email: {user.email}</p>
                </div>
                <div className="my-auto">
                  <button className="btn btn-success">
                    <IoMdPersonAdd />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
