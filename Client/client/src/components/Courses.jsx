import { bool, string } from "prop-types";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import QRCode from "qrcode.react";

import { axiosInstance, apiUrl } from "../support/axios_setting";
import "../styles/homepage/info-modal.css";

const CourseCard = (props) => {
  const { auth, title, instructor, duration, price } = props;

  return (
    <div>
      <div className="course-card">
        <h5>{title}</h5>
        <p>
          <b>Instructor: </b>
          {instructor}
          <br />
          <b>Duration: </b>
          {duration}
          <br />
          <b>Price: </b>
          {price}
        </p>
        <br />
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  auth: bool,
  title: string,
  instructor: string,
  duration: string,
  price: string,
};

const Courses = (props) => {
  const { auth } = props;

  const isSmallScreen = useMediaQuery({ query: "(max-width: 560px)" });
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coursesPerPage, setCoursesPerPage] = useState(4);
  const [initCourses, setInitCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [qrData, setQrData] = useState("");

  const getData = async (address) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/${address}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

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
      if (screenWidth <= 780) {
        setCoursesPerPage(2);
      } else if (screenWidth <= 1080) {
        setCoursesPerPage(3);
      } else {
        setCoursesPerPage(4);
      }
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getData("api/home/hot_trend_courses");
        if (
          data["categoryCount"] &&
          data["categoryCount"].length > 0 &&
          data["educationalCourseDTO"] &&
          data["educationalCourseDTO"].length > 0
        ) {
          const categories = data["categoryCount"];
          const courses = data["educationalCourseDTO"];

          setCategories(categories);
          setInitCourses(courses);
          const newList = [];
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
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Step 2: Handle course click event
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    // Show the purchase form when a course is clicked
    setShowPurchaseModal(true);
  };

  // Step 3: Define a function to close the purchase form modal
  const handleCloseModal = () => {
    setShowPurchaseModal(false);
  };

  return (
    <div className="courses-container">
      <div className="px-xxl-5 px-xl-5 px-lg-5 flex-">
        {categories.map((category) => (
          <a
            onClick={(e) => showCourseByCategory(e, category.category)}
            className={`me-4 text-uppercase ${
              selectedCategory === category.category
                ? "text-decoration-underline"
                : ""
            } d-block d-sm-inline-block`}
            key={category.category}
            style={{ textDecoration: "none" }}
          >
            {category.category}
          </a>
        ))}
      </div>
      <br />
      <Row className="d-flex justify-content-between px-xxl-5 px-xl-5 px-lg-5">
        {currentCourses.map((course) => (
          <Col
            key={course.courseId}
            onClick={() => handleCourseClick(course)}
            style={{ cursor: "pointer", width: "200px", height: "160px" }}
            xs={12}
            sm={6}
            md={4}
            lg={2}
            className="mb-3"
          >
            <CourseCard
              auth={auth}
              title={course.courseName}
              instructor={course.instructor}
              duration={
                course.duration > 1
                  ? `${course.duration} months`
                  : `${course.duration} month`
              }
              price={`${course.price}$`}
            />
          </Col>
        ))}
      </Row>
      {totalPage > 1 && (
        <div className="courses-controls mt-3 px-xxl-5 px-xl-5 px-lg-5 me-2">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="control-button"
          >
            Prev
          </Button>{" "}
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPage}
            className="control-button"
          >
            Next
          </Button>
        </div>
      )}
      {auth && showPurchaseModal && selectedCourse && (
        <div className="purchase-modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <form className="purchaseContainer">
              <fieldset>
                <legend>Purchase - {selectedCourse.courseName}</legend>
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
                    You can leave it blank; we will use our service registration
                    email to send receive.
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="paymentMethods" className="form-label mt-4">
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
                    <label htmlFor="creditCardCVV" className="form-label mt-4">
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
          </div>
        </div>
      )}
      {!auth && showPurchaseModal && selectedCourse && (
        <div className="purchase-modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <div>
              <h1>404</h1>
              <p>Please login to see more.</p>
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
