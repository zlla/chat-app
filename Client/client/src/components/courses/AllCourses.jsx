import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCartShopping,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

import { apiUrl } from "../../support/apiUrl";
import CourseCard from "../home/Course";
import "../../styles/homepage/general.css";
import "../../styles/coursespage/AllCourses.css";
import courseImageList from "../../data/images";
import SortButton from "./SortButton";

const AllCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState("CourseId");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/Courses/all?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      const data = response.data;
      data.forEach((course) => {
        course.linkImage =
          courseImageList[Math.floor(Math.random() * courseImageList.length)];
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, pageSize, sortField, sortOrder]);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isRegisteredCourse, setIsRegisteredCourse] = useState(false);
  const checkRegisteredCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const axiosInstance = axios.create({
        baseURL: apiUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axiosInstance.post(
        `${apiUrl}/api/RegisterCourse/isRegistered`,
        {
          courseId,
        }
      );
      console.log(response);
      if (response.data == true) {
        setIsRegisteredCourse(true);
      } else {
        setIsRegisteredCourse(false);
      }
    } catch (error) {
      setIsRegisteredCourse(false);
      console.log(error);
    }
  };
  const handleCourseClick = (e, course) => {
    checkRegisteredCourse(course.courseId);
    setSelectedCourse(course);
    setShowInfoModal(true);
  };
  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortOrder("ASC");
    }
  };
  const handleCloseModal = () => {
    setShowInfoModal(false);
  };
  const handleNextPage = () => {
    setPage(page + 1);
  };
  const handlePrevPage = () => {
    setPage(Math.max(1, page - 1));
  };
  const handleAddToPlannedClick = () => {};
  const handleDetailsClick = (courseId, linkImage) => {
    navigate(`/courses/${courseId}`, { state: { linkImage } });
  };

  return (
    <div className="px-xxl-5 px-xl-5 px-lg-5 pt-2 mt-3">
      <div className="sort-buttons">
        <SortButton
          field="CourseId"
          label="Course ID"
          sortOrder={sortOrder}
          currentSortField={sortField}
          onClick={() => handleSort("CourseId")}
        />
        <SortButton
          field="CourseName"
          label="Course Name"
          sortOrder={sortOrder}
          currentSortField={sortField}
          onClick={() => handleSort("CourseName")}
        />
        <SortButton
          field="StartDate"
          label="Start Date"
          sortOrder={sortOrder}
          currentSortField={sortField}
          onClick={() => handleSort("StartDate")}
        />
        <SortButton
          field="Duration"
          label="Duration"
          sortOrder={sortOrder}
          currentSortField={sortField}
          onClick={() => handleSort("Duration")}
        />
      </div>
      <Row className="course-item d-flex justify-content-start me-0 mb-5">
        {courses.map((course) => (
          <Col
            key={course.courseId}
            onClick={(e) => handleCourseClick(e, course)}
            style={{ cursor: "pointer", width: "200px", height: "160px" }}
            xs={12}
            sm={6}
            md={4}
            lg={2}
            className="my-5"
          >
            <CourseCard
              title={course.courseName}
              instructor={course.instructor}
              duration={
                course.duration > 1
                  ? `${course.duration} months`
                  : `${course.duration} month`
              }
              price={`${course.price}$`}
              courseImageLink={course.linkImage}
            />
          </Col>
        ))}
      </Row>
      <div className="pagination-buttons">
        <button
          className="pagination-button btn btn-primary"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className="mx-2">Page {page}</span>
        <button
          className="pagination-button btn btn-primary"
          onClick={handleNextPage}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      {showInfoModal && selectedCourse && (
        <div className="info-modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <div className="d-flex justify-content-evenly">
              <div className="container">
                <div className="mx-auto">
                  <div className="px-3 border rounded p-4 shadow-sm">
                    <img
                      src={selectedCourse.linkImage}
                      alt="course image"
                      className="img-fluid rounded"
                    />
                    <h3 className="mt-3 mb-2">{selectedCourse.courseName}</h3>
                    <p className="text-muted">{selectedCourse.description}</p>
                    <div className="align-items-center">
                      <div>
                        <p>
                          Created by: <b>{selectedCourse.instructor}</b>
                        </p>
                        <p>
                          Duration:{" "}
                          <b>
                            {selectedCourse.duration > 1
                              ? `${selectedCourse.duration} months`
                              : `${selectedCourse.duration} month`}
                          </b>
                        </p>
                      </div>
                      <div>
                        <p className="text-muted">
                          <small>
                            {new Date(
                              selectedCourse.startDate
                            ).toLocaleDateString()}{" "}
                            to{" "}
                            {new Date(
                              selectedCourse.endDate
                            ).toLocaleDateString()}
                          </small>
                        </p>
                      </div>
                    </div>
                    <div className="d-flex">
                      {" "}
                      <h2 className="my-auto me-2">${selectedCourse.price}</h2>
                      {!isRegisteredCourse && (
                        <button
                          type="button"
                          className="btn btn-primary me-2"
                          onClick={() => handleAddToPlannedClick()}
                        >
                          <FontAwesomeIcon icon={faCartShopping} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() =>
                          handleDetailsClick(
                            selectedCourse.courseId,
                            selectedCourse.linkImage
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faCircleInfo} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCourses;
