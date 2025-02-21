// backend/projects.js
const express = require('express');
const router = express.Router();

// In-memory storage for projects (simulate cloud storage)
let projects = [
  {
    id: "1",
    name: "Project Alpha",
    folders: ["src", "public", "docs"]
  },
  {
    id: "2",
    name: "Project Beta",
    folders: ["lib", "tests", "config"]
  }
];

// Get all projects
router.get("/", (req, res) => {
  res.json(projects);
});

// Get a project by ID
router.get("/:id", (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (project) res.json(project);
  else res.status(404).json({ error: "Project not found" });
});

// You can add POST/PUT/DELETE routes to create, update, or delete projects
module.exports = router;
