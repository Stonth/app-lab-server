/*
    This is the object containing the function which converts JSON to PNG (convert). First,
    it converts the the JSON to a string. Then, it encodes this string as a BMP image. Finally,
    because code.org cannot load BMP images, the image is converted to a PNG.
*/

const jimp = require('jimp');

module.exports = {

    /*
        Note: This page was a big help:
        http://www.ece.ualberta.ca/~elliott/ee552/studentAppNotes/2003_w/misc/bmp_file_format/bmp_file_format.htm
    */

    BYTES_PER_CHAR: 4,
    HEADER_LENGTH: 14,
    INFO_LENGTH: 40,
    SIGNATURE: 'BM',

    // Convert a JSON object to a PNG.
    convert: function (obj) {
        return new Promise((resolve, reject) => {
            const strObject = JSON.stringify(obj);

            const buffArray = new Uint8Array(this.getBufferSize(strObject));
            let ind = this.writeHeaders(0, buffArray, strObject);

            this.writePixels(ind, buffArray, strObject);

            jimp.read(Buffer.from(buffArray.buffer)).then((image) => {
                image.getBufferAsync(jimp.MIME_PNG).then((buff) => {
                    resolve(buff);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    },

    // Get the heigh needed to encode the JSON.
    getHeightNeeded: function (str) {
        return Math.ceil(Math.sqrt(Math.ceil((str.length * this.BYTES_PER_CHAR + 4) / 3)));
    },

    // Get the width needed to encode the JSON.
    getWidthNeeded: function (str) {
        return Math.ceil(this.getHeightNeeded(str) / 4) * 4;
    },

    // Write the header and info for the image. Basically, just some BMP stuff.
    writeHeaders: function (start, buffArray, strObject) {
        let ind = start;

        // Signature.
        buffArray.set([...this.SIGNATURE].map(ch => ch.charCodeAt(0)), ind);
        ind += 2;

        // File size.
        buffArray.set(this.uint32ToUint8Array(this.getBufferSize(strObject)), ind);
        ind += 4;

        // Reserved.
        buffArray.set(this.uint32ToUint8Array(0), ind);
        ind += 4;

        // Data offset.
        buffArray.set(this.uint32ToUint8Array(this.HEADER_LENGTH + this.INFO_LENGTH), ind);
        ind += 4;

        // Size of info header.
        buffArray.set(this.uint32ToUint8Array(this.INFO_LENGTH), ind);
        ind += 4;

        // Width and height.
        buffArray.set(this.uint32ToUint8Array(this.getWidthNeeded(strObject)), ind);
        ind += 4;
        buffArray.set(this.uint32ToUint8Array(-this.getHeightNeeded(strObject)), ind);
        ind += 4;

        // Planes.
        buffArray.set([1, 0], ind);
        ind += 2;

        // Bits per pixel.
        buffArray.set([24, 0], ind);
        ind += 2;

        // Compression.
        buffArray.set(this.uint32ToUint8Array(0), ind);
        ind += 4;

        // Image size.
        buffArray.set(this.uint32ToUint8Array(0), ind);
        ind += 4;

        // Pixels per meter.
        buffArray.set(this.uint32ToUint8Array(0), ind);
        ind += 4;
        buffArray.set(this.uint32ToUint8Array(0), ind);
        ind += 4;

        // Colors used.
        buffArray.set(this.uint32ToUint8Array(0xFFFFFFFF), ind);
        ind += 4;

        // Important colors.
        buffArray.set(this.uint32ToUint8Array(0), ind);
        ind += 4;

        return ind;
    },

    // Write the actual pixels of the image. This will include the length of the string,
    // as well as the data itself.
    writePixels: function (start, buffArray, strObject) {
        let arrayIndex = start;

        // Write character by characer.
        const w = this.getWidthNeeded(strObject);
        const h = this.getHeightNeeded(strObject);
        let cur = 0;
        const bytes = [...this.uint32ToUint8Array(strObject.length)];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (x < h) {
                    if (bytes.length < 3) {
                        if (cur < strObject.length) {
                            bytes.push(...this.uint32ToUint8Array(strObject.charCodeAt(cur++)));
                        } else {
                            bytes.push(0, 0, 0, 0);
                        }
                    }
                buffArray.set(bytes.splice(0, 3), arrayIndex);
                arrayIndex += 3;
                } else {
                    buffArray.set([0, 0, 0], arrayIndex);
                    arrayIndex += 3;
                }
            }
        }
    },

    // Converts an unsigned 32 bit integer (there are a lot of those in this application) to
    // a 4 element array of unsigned 8 bit integers.
    uint32ToUint8Array: function (val) {
        return [val >> 0, val >> 8, val >> 16, val >> 24].map(x => x & 0xFF);
    },

    // Get the side the buffer will need to be based on the JSON string being encoded.
    getBufferSize: function (str) {
        return this.HEADER_LENGTH + this.INFO_LENGTH + this.getWidthNeeded(str) * this.getHeightNeeded(str) * 3;
    }
};