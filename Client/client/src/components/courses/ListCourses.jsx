import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { string } from "prop-types";

import courseImageList from "../../data/images";
import { apiUrl } from "../../support/apiUrl";

const ListCourses = (props) => {
  const { status } = props;
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const handleViewDetails = (courseID) => {
    window.scrollTo(0, 0);
    navigate(`/courses/${courseID}`, {
      state: {
        linkImage: `${
          courseImageList[Math.floor(Math.random() * courseImageList.length)]
        }`,
      },
    });
  };

  useEffect(() => {
    const fetchListCourses = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/RegisterCourse/getCoursesRegistered`,
          {
            params: {
              enrollmentStatus: status,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setEnrollments(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListCourses();
  }, [status]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnrollments = enrollments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Course Name</th>
            <th scope="col">Instructor</th>
            <th scope="col">Enrollment Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEnrollments.map((enrollment) => (
            <tr key={enrollment.enrollmentID}>
              <td>{enrollment.courseName}</td>
              <td>{enrollment.instructor}</td>
              <td>{enrollment.enrollmentDate}</td>
              <td>{enrollment.status}</td>
              <td>
                {status == "active" && (
                  <button
                    onClick={() => handleViewDetails(enrollment.courseID)}
                    className="btn btn-info"
                  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </button>
                )}
                {status == "pending" && (
                  <input className="form-check-input" type="checkbox" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from({
            length: Math.ceil(enrollments.length / itemsPerPage),
          }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ListCourses.propTypes = {
  status: string,
};

export default ListCourses;
