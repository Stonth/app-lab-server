/*
    This object is used to check for duplicate requests. I think App Lab issues duplicate requests
    after 3 seconds if an image has not yet been recieved.
*/

const DupeChecker = function () {
    this.duplicates = {};
};

DupeChecker.prototype.TIMEOUT = 10;

DupeChecker.prototype.check = function (req) {
    const key = req.path;
    if (this.duplicates[key]) {
        return false;
    } else {
        this.duplicates[key] = setTimeout(() => {
            delete this.duplicates[key];
        }, this.TIMEOUT * 1000);
        return true;
    }
};

module.exports = DupeChecker;