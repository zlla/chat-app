import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { apiUrl } from "../../support/axios_setting";
import CourseCard from "../home/Course";
import "../../styles/homepage/general.css";
import "../../styles/coursespage/AllCourses.css";
import courseImageList from "../../data/images";

const AllCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/Courses/all?page=${page}&pageSize=${pageSize}`
        );
        const data = response.data;
        data.forEach((course) => {
          course.linkImage =
            courseImageList[Math.floor(Math.random() * courseImageList.length)];
        });
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [page, pageSize]);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalStyle, setModalStyle] = useState({
    width: "30%",
  });
  const changeStyle = (param) => {
    setModalStyle({
      width: `${param}%`,
    });
  };
  const handleCourseClick = (e, course) => {
    setSelectedCourse(course);
    setShowInfoModal(true);
  };
  const handleCloseModal = () => {
    changeStyle(30);
    setShowInfoModal(false);
  };
  const handleNextPage = () => {
    setPage(page + 1);
  };
  const handlePrevPage = () => {
    setPage(Math.max(1, page - 1));
  };
  const handleBuyNowClick = () => {
    changeStyle(60);
  };
  const handleDetailsClick = (courseId, linkImage) => {
    navigate(`/courses/${courseId}`, { state: { linkImage } });
  };

  return (
    <div>
      <Row className="course-item d-flex justify-content-start px-xxl-5 px-xl-5 px-lg-5 me-0">
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
      <div className="pagination-buttons px-xxl-5 px-xl-5 px-lg-5 pt-2 mt-5">
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
          <div className="modal-content" style={modalStyle}>
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
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={() => handleBuyNowClick()}
                      >
                        Buy Now
                      </button>
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
                        Details
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
