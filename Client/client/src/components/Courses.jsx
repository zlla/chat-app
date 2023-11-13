import { string } from "prop-types";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

import { axiosInstance, apiUrl } from "../support/axios_setting";

const CourseCard = (props) => {
  const { title, instructor, duration, price } = props;

  return (
    <Col xs={12} sm={6} md={4} lg={2} className="mb-3 px-0">
      <div className="course-card">
        <h5>{title}</h5>
        <p>
          Instructor: {instructor}
          <br />
          Duration: {duration}
          <br />
          Price: {price}
        </p>
      </div>
    </Col>
  );
};

CourseCard.propTypes = {
  title: string,
  instructor: string,
  duration: string,
  price: string,
};

const Courses = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 560px)" });
  const [courses, setCourses] = useState([]);
  const [coursesPerPage, setCoursesPerPage] = useState(4);

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

  const getData = async (address) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/${address}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesResponse = await getData("api/home");
        if (coursesResponse && coursesResponse.length > 0) {
          setCourses(coursesResponse);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error(error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

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

  return (
    <div className="courses-container">
      <Row className="d-flex justify-content-between px-xxl-5 px-xl-5 px-lg-5 mx-0">
        {currentCourses.map((course) => (
          <CourseCard
            key={course.courseId}
            title={course.courseName}
            instructor={course.instructor}
            duration={
              course.duration > 1
                ? `${course.duration} months`
                : `${course.duration} month`
            }
            price={`${course.price}$`}
          />
        ))}
      </Row>
      {totalPage > 1 && (
        <div className="courses-controls mt-3 px-xxl-5 px-xl-5 px-lg-5">
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
    </div>
  );
};

export default Courses;
