import { func } from "prop-types";
import { number, string } from "prop-types";

const SortButton = ({ field, label, sortOrder, currentSortField, onClick }) => (
  <button
    className={`btn btn-primary me-2 ${
      currentSortField === field ? "active" : ""
    }`}
    onClick={onClick}
  >
    {label} {currentSortField === field && (sortOrder === "ASC" ? "↑" : "↓")}
  </button>
);

SortButton.propTypes = {
  field: string,
  label: string,
  sortOrder: string,
  currentSortField: string,
  onClick: func,
};

export default SortButton;
