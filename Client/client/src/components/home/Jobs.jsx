import { bool, number, string } from "prop-types";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import { apiUrl } from "../../support/axios_setting";

import "../../styles/homepage/general.css";
import "../../styles/homepage/info-modal.css";
import axios from "axios";

const JobCard = (props) => {
  const { title, salary, postingDate } = props;

  return (
    <div>
      <div className="course-card">
        <h5>{title}</h5>
        <p>
          <b>Salary: </b>
          {salary}
          <br />
          <b>Posting Date: </b>
          {postingDate}
        </p>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  title: string,
  salary: number,
  postingDate: string,
};

const Jobs = (props) => {
  const { auth } = props;

  const isSmallScreen = useMediaQuery({ query: "(max-width: 560px)" });
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobsPerPage, setJobsPerPage] = useState(4);
  const [initJobs, setInitJobs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getData = async (apiRoute) => {
    try {
      const token = localStorage.getItem("accessToken");
      const axiosInstance = axios.create({
        baseURL: apiUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axiosInstance.get(`${apiUrl}/${apiRoute}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const showJobByCategory = (e, category) => {
    e.preventDefault();
    const newList = [];
    initJobs.forEach((job) => {
      if (job.industryType == e.target.innerHTML) {
        newList.push(job);
      }
    });
    setJobs(newList);
    setSelectedCategory(category);
  };

  const handleOkButtonClick = (e) => {
    console.log(e);
  };

  useEffect(() => {
    if (isSmallScreen) {
      setJobsPerPage(1);
    } else {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) {
        setJobsPerPage(3);
      } else if (screenWidth <= 1024) {
        setJobsPerPage(4);
      } else if (screenWidth <= 1280) {
        setJobsPerPage(5);
      } else {
        setJobsPerPage(6);
      }
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getData("api/home/hot_trend_jobs");
        if (
          data["categoryCount"] &&
          data["categoryCount"].length > 0 &&
          data["jobOpportunityDTO"] &&
          data["jobOpportunityDTO"].length > 0
        ) {
          const categories = data["categoryCount"];
          const jobs = data["jobOpportunityDTO"];

          setCategories(categories);
          setInitJobs(jobs);
          const newList = [];
          jobs.forEach((job) => {
            if (job.industryType == categories[0].category) {
              newList.push(job);
            }
          });
          setJobs(newList);
          setSelectedCategory(categories[0].category);
        }
      } catch (error) {
        console.error(error);
        setCategories([]);
        setJobs([]);
      }
    };

    fetchJobs();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = Math.ceil(jobs.length / jobsPerPage);
  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPage));
  };
  const handlePrev = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const startIdx = (currentPage - 1) * jobsPerPage;
  const endIdx = Math.min(startIdx + jobsPerPage, jobs.length);
  const currentJobs =
    jobs.length < jobsPerPage ? [] : jobs.slice(startIdx, endIdx);

  // Step 1: Create state to track whether the purchase form should be displayed
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Step 2: Handle course click event
  const handleJobClick = (course) => {
    setSelectedCourse(course);
    // Show the purchase form when a course is clicked
    setShowInfoModal(true);
  };

  // Step 3: Define a function to close the purchase form modal
  const handleCloseModal = () => {
    setShowInfoModal(false);
  };

  return (
    <div className="courses-container">
      <div className="px-xxl-5 px-xl-5 px-lg-5 flex- mb-3">
        {categories.map((category) => (
          <a
            onClick={(e) => showJobByCategory(e, category.category)}
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
      <Row className="courses-item  d-flex justify-content-start px-xxl-5 px-xl-5 px-lg-5 me-0">
        {currentJobs.map((job) => (
          <Col
            key={job.jobID}
            onClick={() => handleJobClick(job)}
            style={{ cursor: "pointer", width: "200px", height: "160px" }}
            xs={12}
            sm={6}
            md={4}
            lg={2}
            className="mb-3"
          >
            <JobCard
              auth={auth}
              title={job.jobTitle}
              salary={job.salary}
              postingDate={job.postingDate}
            />
          </Col>
        ))}
      </Row>
      {totalPage > 1 && (
        <div className="courses-controls pt-5 mt-5 px-xxl-5 px-xl-5 px-lg-5 me-2">
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
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <form className="purchaseContainer">
              <fieldset>
                <legend>Apply</legend>
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

Jobs.propTypes = {
  auth: bool,
};

export default Jobs;
