import React, { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiStar,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { TiPinOutline } from "react-icons/ti";
import "./App.css";

const initialWorkflows = Array.from({ length: 100 }, (_, i) => ({
  id: 400 + i,
  name: `Workflow ${i + 1}`,
  editor: ["Zubin Khanna", "Jane Doe", "Alice Smith", "Bob Johnson"][i % 4],
  timestamp: `${Math.floor(Math.random() * 24)}:${Math.floor(
    Math.random() * 60
  )} IST - ${Math.floor(Math.random() * 28) + 1}/${
    Math.floor(Math.random() * 12) + 1
  }`,
  description: `Description for workflow ${i + 1}.`,
  starred: Math.random() > 0.5,
}));

const validInitialWorkflows = initialWorkflows.filter((wf) => wf != null);

const Header = () => (
  <div className="workflow-header">
    <span className="menu-icon">☰</span>
    <h1>Workflow Builder</h1>
  </div>
);

const ActionBar = () => (
  <div className="action-bar">
    <div className="search-container">
      <input type="search" placeholder="Search By Workflow Name / ID" />
      <FiSearch className="search-icon" />
    </div>
    <button className="create-button">
      <FiPlus /> Create New Process
    </button>
  </div>
);

const WorkflowTableRow = ({ workflow, onStarToggle }) => {
  const id = workflow?.id ?? "N/A";
  const name = workflow?.name ?? "Unnamed Workflow";
  const editor = workflow?.editor ?? "Unknown Editor";
  const timestamp = workflow?.timestamp ?? "-";
  const description = workflow?.description ?? "No description.";
  const isStarred = workflow?.starred ?? false;

  return (
    <tr>
      <td>{name}</td>
      <td>#{id}</td>
      <td>
        {editor} | {timestamp}
      </td>
      <td>{description}</td>
      <td className="actions-cell">
        {id !== "N/A" && (
          <button
            onClick={() => onStarToggle(id)}
            className="icon-button star-button"
            disabled={id === "N/A"}
          >
            {isStarred ? (
              <TiPinOutline style={{ color: "orange" }} />
            ) : (
              <TiPinOutline />
            )}
          </button>
        )}
        <button className="text-button execute-button" disabled={id === "N/A"}>
          Execute
        </button>
        <button className="text-button edit-button" disabled={id === "N/A"}>
          Edit
        </button>
        <button className="icon-button more-button" disabled={id === "N/A"}>
          <FiMoreVertical />
        </button>
      </td>
    </tr>
  );
};

const WorkflowTable = ({ workflows, onStarToggle }) => (
  <div className="workflow-table-container">
    <table>
      <thead>
        <tr>
          <th>Workflow Name</th>
          <th>ID</th>
          <th>Last Edited On</th>
          <th>Description</th>
          <th>{/* Actions */}</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(workflows) &&
          workflows.map((wf) => (
            <WorkflowTableRow
              key={wf?.id ?? Math.random()}
              workflow={wf}
              onStarToggle={onStarToggle}
            />
          ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination">
    <button
      className="page-button prev-button"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <FiChevronLeft />
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={`page-button page-number ${
          currentPage === page ? "active" : ""
        }`}
        onClick={() => onPageChange(page)}
      >
        {page}
      </button>
    ))}
    <button
      className="page-button next-button"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <FiChevronRight />
    </button>
  </div>
);

function WorkflowBuilderPage() {
  const [workflows, setWorkflows] = useState(validInitialWorkflows);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleStarToggle = (id) => {
    setWorkflows((currentWorkflows) =>
      currentWorkflows.map((wf) =>
        wf && wf.id === id ? { ...wf, starred: !wf.starred } : wf
      )
    );
  };

  const totalPages = Math.ceil(workflows.length / itemsPerPage);
  const paginatedWorkflows = workflows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="workflow-page">
      <Header />
      <div className="workflow-content">
        <ActionBar />
        <WorkflowTable
          workflows={paginatedWorkflows}
          onStarToggle={handleStarToggle}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default WorkflowBuilderPage;
