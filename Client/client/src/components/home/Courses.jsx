import { bool } from "prop-types";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import QRCode from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "../../styles/homepage/general.css";
import "../../styles/homepage/info-modal.css";
import { apiUrl } from "../../support/apiUrl";
import CourseCard from "./Course";
import courseImageList from "../../data/images";
import axios from "axios";

const Courses = (props) => {
  const { auth } = props;

  const isSmallScreen = useMediaQuery({ query: "(max-width: 560px)" });
  const [coursesPerPage, setCoursesPerPage] = useState(4);
  const [initCourses, setInitCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [qrData, setQrData] = useState("");

  const showCourseByCategory = (e, category) => {
    e.preventDefault();
    const newList = [];
    initCourses.forEach((course) => {
      if (course.courseCategory == e.target.innerHTML) {
        newList.push(course);
      }
    });
    setCourses(newList);
    setSelectedCategory(category);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleOkButtonClick = (e) => {
    console.log(e);
  };

  useEffect(() => {
    if (isSmallScreen) {
      setCoursesPerPage(1);
    } else {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) {
        setCoursesPerPage(3);
      } else if (screenWidth <= 1024) {
        setCoursesPerPage(4);
      } else if (screenWidth <= 1280) {
        setCoursesPerPage(5);
      } else {
        setCoursesPerPage(6);
      }
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const axiosInstance = axios.create({
          baseURL: apiUrl,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const getData = async (apiRoute) => {
          try {
            const response = await axiosInstance.get(`${apiUrl}/${apiRoute}`);
            return response.data;
          } catch (error) {
            console.error(error);
            return [];
          }
        };

        const data = await getData("api/home/hot_trend_courses");
        if (
          data["categoryCount"] &&
          data["categoryCount"].length > 0 &&
          data["educationalCourseDTO"] &&
          data["educationalCourseDTO"].length > 0
        ) {
          const categories = data["categoryCount"];
          const courses = data["educationalCourseDTO"];
          const newList = [];

          courses.forEach((course) => {
            course.linkImage =
              courseImageList[
                Math.floor(Math.random() * courseImageList.length)
              ];
          });

          setCategories(categories);
          setInitCourses(courses);
          courses.forEach((course) => {
            if (course.courseCategory == categories[0].category) {
              newList.push(course);
            }
          });
          setCourses(newList);
          setSelectedCategory(categories[0].category);
        }
      } catch (error) {
        setCategories([]);
        setCourses([]);
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedPaymentMethod === "Qr") {
      const randomQrData = Math.random().toString(36).substring(7);
      setQrData(randomQrData);
    } else {
      setQrData("");
    }
  }, [selectedPaymentMethod]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = Math.ceil(courses.length / coursesPerPage);
  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPage));
  };
  const handlePrev = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const startIdx = (currentPage - 1) * coursesPerPage;
  const endIdx = Math.min(startIdx + coursesPerPage, courses.length);
  const currentCourses =
    courses.length < coursesPerPage ? [] : courses.slice(startIdx, endIdx);

  // Step 1: Create state to track whether the purchase form should be displayed
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalStyle, setModalStyle] = useState({
    width: "30%",
  });
  const changeStyle = (param) => {
    setModalStyle({
      width: `${param}%`,
    });
  };

  // Step 2: Handle course click event
  const handleCourseClick = (e, course) => {
    setSelectedCourse(course);
    // Show the purchase form when a course is clicked
    setShowInfoModal(true);
  };
  // Step 3: Define a function to close the purchase form modal
  const handleCloseModal = () => {
    changeStyle(30);
    setShowInfoModal(false);
    setShowPurchaseForm(false);
  };
  const handleBuyNowClick = () => {
    changeStyle(60);
    setShowPurchaseForm(true);
  };

  return (
    <div className="courses-container px-xxl-5 px-xl-5 px-lg-5">
      <div className="mb-3">
        {categories.map((category) => (
          <a
            onClick={(e) => showCourseByCategory(e, category.category)}
            className={`me-4 text-uppercase ${
              selectedCategory === category.category
                ? "text-decoration-underline"
                : ""
            } d-block d-sm-inline-block`}
            key={category.category}
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            {category.category}
          </a>
        ))}
      </div>
      <Row className="course-item d-flex justify-content-start me-0">
        {currentCourses.map((course) => (
          <Col
            key={course.courseId}
            onClick={(e) => handleCourseClick(e, course)}
            style={{ cursor: "pointer", width: "200px", height: "160px" }}
            xs={12}
            sm={6}
            md={4}
            lg={2}
            className="mb-3"
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
      {totalPage > 1 && (
        <div className="courses-controls">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="control-button"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>{" "}
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPage}
            className="control-button"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      )}
      {auth && showInfoModal && selectedCourse && (
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
                        className="btn btn-primary"
                        onClick={() => handleBuyNowClick()}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {showPurchaseForm && (
                <form className="purchaseContainer mt-4 px-3">
                  <fieldset>
                    <legend>
                      Purchase - <b>{selectedCourse.courseName}</b>
                    </legend>
                    <div className="form-group">
                      <label htmlFor="emailInput" className="form-label mt-4">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="emailInput"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                      />
                      <small id="emailHelp" className="form-text text-muted">
                        You can leave it blank; we will use our service
                        registration email to send receive.
                      </small>
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="paymentMethods"
                        className="form-label mt-4"
                      >
                        Payment Method
                      </label>
                      <select
                        className="form-select"
                        id="paymentMethods"
                        onChange={handlePaymentMethodChange}
                        value={selectedPaymentMethod}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Qr">Qr</option>
                      </select>
                    </div>

                    {selectedPaymentMethod === "Credit Card" && (
                      <div className="form-group">
                        <label
                          htmlFor="creditCardNumber"
                          className="form-label mt-4"
                        >
                          Credit Card Number
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="creditCardNumber"
                          placeholder="Enter credit card number"
                        />
                        <label
                          htmlFor="creditCardCVV"
                          className="form-label mt-4"
                        >
                          CGV
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="creditCardCVV"
                          placeholder="Enter CVV number"
                        />
                        <label
                          htmlFor="creditCardExpiredDate"
                          className="form-label mt-4"
                        >
                          Expired Date
                        </label>
                        <input
                          type="month"
                          className="form-control"
                          id="creditCardExpiredDate"
                          placeholder="Enter CVV number"
                        />
                      </div>
                    )}

                    {selectedPaymentMethod === "Qr" && (
                      <div className="form-group">
                        <label className="form-label mt-4">QR Code</label>
                        <br />
                        <QRCode
                          value={qrData}
                          style={{ width: "160px", height: "160px" }}
                        />
                      </div>
                    )}
                  </fieldset>
                  <br />
                  <button
                    type="button"
                    className="btn btn-danger float-end"
                    onClick={(e) => handleOkButtonClick(e)}
                  >
                    Ok
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {!auth && showInfoModal && selectedCourse && (
        <div className="info-modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <div>
              <h1>404</h1>
              <p>
                Please <Link to={"/auth/login"}>Login</Link> to see more.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Courses.propTypes = {
  auth: bool,
};

export default Courses;
