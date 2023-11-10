import Courses from "../components/Courses";

const Home = () => {
  return (
    <>
      <div
        id="demo"
        className="px-xxl-5 px-xl-5 carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://img-c.udemycdn.com/notices/home_carousel_slide/image/1a871a12-4289-4d90-90e8-641d10a73f69.jpg"
              alt="Los Angeles"
              className="d-block w-100"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img-c.udemycdn.com/notices/home_carousel_slide/image/615d1582-f86e-4172-bf58-7ae5d7b580ab.jpg"
              alt="Chicago"
              className="d-block w-100"
            />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#demo"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#demo"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      <div className="my-4 px-5">
        <div>
          <div className="px-xxl-5 px-xl-5 px-lg-5">
            <h1>A broad selection of courses</h1>
            <p>
              Choose from over 210,000 online video courses with new additions
              published every month
            </p>
          </div>
          <Courses />
        </div>
      </div>
    </>
  );
};
export default Home;
