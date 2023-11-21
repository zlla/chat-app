import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../support/apiUrl";
import axios from "axios";
import { IoMdPersonAdd } from "react-icons/io";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import courseImageList from "../data/images";

const CourseDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { linkImage } = state;

  const { courseId } = useParams();
  const [details, setDetails] = useState(null);
  const [otherCourses, setOtherCourses] = useState();

  const moveToOtherCourse = (e, courseId) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate(`/courses/${courseId}`, {
      state: {
        linkImage: `${
          courseImageList[Math.floor(Math.random() * courseImageList.length)]
        }`,
      },
    });
  };

  useEffect(() => {
    const fetchData = async (setValue, address) => {
      try {
        const response = await axios(`${apiUrl}/${address}`);
        const data = await response.data;
        setValue(data);

        const otherCoursesResponse = await axios(
          `${apiUrl}/api/courses/relatedCourse/?instructor=${data.educationalCourseDTO.instructor}`
        );
        console.log(otherCoursesResponse);
        const otherCoursesData = await otherCoursesResponse.data;
        setOtherCourses(otherCoursesData);
        console.log(otherCoursesData);
      } catch (error) {
        setValue([]);
        console.error("Error fetching course details:", error);
      }
    };

    fetchData(setDetails, `api/courses/all/${courseId}`);
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
          <h2 className="mt-4">
            Other Courses by {details.educationalCourseDTO.instructor}:
          </h2>
          <ul className="list-group">
            {otherCourses &&
              otherCourses.map((course) => (
                <li
                  key={course.courseId}
                  className="list-group-item d-flex justify-content-between"
                >
                  <div>
                    <Link
                      onClick={(e) => moveToOtherCourse(e, course.courseId)}
                    >
                      <p className="mb-1">{course.courseName}</p>
                    </Link>
                    <p>Description: {course.description}</p>
                  </div>
                  <div className="my-auto">
                    <button className="btn btn-success">
                      <FontAwesomeIcon icon={faCartShopping} />
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
