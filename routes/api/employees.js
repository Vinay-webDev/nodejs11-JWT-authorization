const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');

// if you want to protect all the routes not only the .get() we can do that 
router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee)

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;








