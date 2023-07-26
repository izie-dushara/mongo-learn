// Connecting to the model
const Employee = require("../model/Employee");

// route("/").get()
const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "No employees found." });
  res.json(employees);
};

// route("/").post()
const createNewEmployee = async (req, res) => {
  // required validation
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required" });
  }

  try {
    // Create document
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

// route("/").put()
const updateEmployee = async (req, res) => {
  // id validation
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  // Get employee
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  // Employee exist validation
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches with ID: ${req.body.id}` });
  }

  // set new value
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  // Save to db
  const result = await employee.save();
  res.json(result);
};

// route("/").delete()
const deleteEmployee = async (req, res) => {
  // id validation
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID required" });
  }

  // Find employee
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  // Employee not found
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches with ID: ${req.body.id}` });
  }

  // Delete from the db
  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

// route(""/:id"").get()
const getEmployee = async (req, res) => {
  // id validation
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Employee ID required" });
  }

  // Find employee
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  // Employee not found
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches with ID: ${req.params.id}` });
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
