import { number, string } from "prop-types";
import { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

const CourseCard = (props) => {
  const { title, instructor, rating, price } = props;

  return (
    <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
      <div className="course-card">
        <h2>{title}</h2>
        <p>
          Instructor: {instructor}
          <br />
          Rating: {rating}
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
  rating: number,
  price: number,
};

const Courses = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const coursesPerPage = isSmallScreen ? 1 : 4;
  const [courses, setCourses] = useState([
    {
      title: "Python for Data Science and Machine Learning Bootcamp",
      instructor: "Jose Portilla",
      rating: 4.6,
      price: 1999000,
    },
    {
      title: "Python Programming - From Basics to Advanced level",
      instructor: "EdYoda Digital University, Dipesh Sharma",
      rating: 4.2,
      price: 1099000,
    },
    {
      title: "Learn Python Programming Masterclass",
      instructor: "Tim Buchalika. Jean-Paul Roberts, Tim Buchalika",
      rating: 4.6,
      price: 2399000,
    },
    {
      title: "Python for beginners - the basics of python",
      instructor: "Yassin Marco",
      rating: 4.3,
      price: 1399000,
    },
    {
      title: "Learn to Code in Python 3: Programming beginner to advanced",
      instructor: "Ivan Lourenço Gomes, Learn IT University",
      price: 1399000,
    },
  ]);

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
      <Row className="justify-content-center mx-0">
        {currentCourses.map((course) => (
          <CourseCard
            key={course.title}
            title={course.title}
            instructor={course.instructor}
            rating={course.rating}
            price={course.price}
          />
        ))}
      </Row>
      <div className="courses-controls mt-3">
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
    </div>
  );
};

export default Courses;
