"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoleData = exports.prepareUserData = exports.handleRoleData = void 0;
const customError_js_1 = require("./customError.js");
const formatWord_js_1 = require("./formatWord.js");
const handleRoleData = (body) => {
    if (typeof body.roles === 'string') {
        body.roles = body.roles.split(',').map((role) => role.trim());
    }
    if (body.roles.includes('sitter') && typeof body.acceptedPets === 'string') {
        body.acceptedPets = body.acceptedPets
            .split(',')
            .map((pet) => pet.trim());
    }
    if (body.roles.includes('owner') && typeof body.pets === 'string') {
        body.pets = body.pets.split(',').map((pet) => pet.trim());
    }
};
exports.handleRoleData = handleRoleData;
const prepareUserData = (body, file) => {
    const userData = {
        email: body.email,
        password: body.password,
        roles: body.roles,
        profilePicture: file ? `/${file.filename}` : '/default-profile-picture.png',
        firstName: (0, formatWord_js_1.capitalizeFirstLetter)(body.firstName),
        lastName: (0, formatWord_js_1.capitalizeFirstLetter)(body.lastName),
        city: (0, formatWord_js_1.capitalizeFirstLetter)(body.city),
        country: (0, formatWord_js_1.capitalizeFirstLetter)(body.country),
    };
    if (body.roles.includes('sitter')) {
        userData.roleDetails = {
            sitter: {
                tel: body.tel,
                presentation: body.presentation,
                acceptedPets: body.acceptedPets,
            },
        };
    }
    if (body.roles.includes('owner')) {
        userData.roleDetails = {
            ...userData.roleDetails,
            owner: {
                pets: body.pets,
            },
        };
    }
    return userData;
};
exports.prepareUserData = prepareUserData;
const validateRoleData = (body) => {
    if (body.roles.includes('sitter')) {
        if (!body.tel) {
            throw new customError_js_1.CustomError(400, 'Telephone number is required for sitters');
        }
        if (!body.presentation) {
            throw new customError_js_1.CustomError(400, 'Presentation is required for sitters');
        }
        if (!body.acceptedPets) {
            throw new customError_js_1.CustomError(400, 'Accepted pets are required for sitters');
        }
    }
    if (body.roles.includes('owner')) {
        if (!body.pets) {
            throw new customError_js_1.CustomError(400, 'Pets are required for owners');
        }
    }
};
exports.validateRoleData = validateRoleData;
//# sourceMappingURL=utilsUser.js.map