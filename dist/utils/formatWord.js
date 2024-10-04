"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeFirstLetter = void 0;
const capitalizeFirstLetter = (word) => {
    if (!word)
        return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;
//# sourceMappingURL=formatWord.js.map