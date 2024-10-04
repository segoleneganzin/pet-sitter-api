"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponseCreate = exports.handleResponse = void 0;
const customError_js_1 = require("./customError.js");
// Function to handle errors and send a response
const handleError = (controller, res, error) => {
    console.error(`Something went wrong in ${controller}`, error);
    // Check if the error is an instance of CustomError
    if (error instanceof customError_js_1.CustomError) {
        res.status(error.status).json({
            status: error.status,
            message: error.message,
        });
    }
    else {
        // Default to 500 for unexpected errors
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
};
// Function to handle successful responses for general cases
const handleResponse = (controller, res, promise, successMessage = 'Success') => {
    promise
        .then((responseFromService) => {
        res.status(200).send({
            status: 200,
            message: successMessage,
            body: responseFromService,
        });
    })
        .catch((error) => handleError(controller, res, error));
};
exports.handleResponse = handleResponse;
// Function to handle successful responses for creation cases
const handleResponseCreate = (controller, res, promise) => {
    promise
        .then((responseFromService) => {
        res.status(201).send({
            status: 201,
            message: 'Resource created successfully',
            body: responseFromService,
        });
    })
        .catch((error) => handleError(controller, res, error));
};
exports.handleResponseCreate = handleResponseCreate;
//# sourceMappingURL=utilsController.js.map