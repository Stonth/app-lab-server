module.exports = {

    /*
        Note: This page was a big help:
        http://www.ece.ualberta.ca/~elliott/ee552/studentAppNotes/2003_w/misc/bmp_file_format/bmp_file_format.htm
    */

    BYTES_PER_CHAR: 4,
    HEADER_LENGTH: 14,
    INFO_LENGTH: 40,
    SIGNATURE: 'BM',

    convert: function (obj) {
        const strObject = JSON.stringify(obj);
        
        const buffArray = new Uint8Array(this.getBufferSize(strObject));
        let ind = this.writeHeaders(0, buffArray, strObject);

        this.writePixels(ind, buffArray, strObject);

        return Buffer.from(buffArray.buffer);
    },

    getPixelsNeeded: function (str) {
        return Math.ceil((str.length * this.BYTES_PER_CHAR) / 12) * 4;
    },

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
        buffArray.set(this.uint32ToUint8Array(this.getPixelsNeeded(strObject)), ind);
        ind += 4;
        buffArray.set(this.uint32ToUint8Array(1), ind);
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

    writePixels: function (start, buffArray, strObject) {
        let arrayIndex = start;

        let byteIndex = 0;

        // Write character by characer.
        for (let i = 0; i < strObject.length; i++) {
            buffArray.set(this.uint32ToUint8Array(strObject.charCodeAt(i)), arrayIndex);
            arrayIndex += 4;
            byteIndex = byteIndex + 4;
        }

        // Finish the remaining pixel + padding.
        while (byteIndex % 12 > 0) {
            buffArray.set([0], arrayIndex);
            arrayIndex++;
            byteIndex++;
        }
    },

    uint32ToUint8Array: function (val) {
        return [val >> 0, val >> 8, val >> 16, val >> 24].map(x => x);
    },

    getBufferSize: function (str) {
        return this.HEADER_LENGTH + this.INFO_LENGTH + this.getPixelsNeeded(str) * 3;
    }

};