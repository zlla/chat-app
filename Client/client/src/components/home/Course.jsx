import { string } from "prop-types";

const CourseCard = (props) => {
  const { title, instructor, duration, price, courseImageLink } = props;

  return (
    <div className="course-card">
      <div>
        <img
          src={courseImageLink}
          alt=""
          style={{ width: "100%", height: "100px" }}
          className="mb-2"
        />
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
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  title: string,
  instructor: string,
  duration: string,
  price: string,
  courseImageLink: string,
};

export default CourseCard;
