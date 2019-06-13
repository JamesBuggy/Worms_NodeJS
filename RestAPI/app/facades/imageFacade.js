var fs = require('fs');

module.exports = class ImageFacade {

    constructor() {
        this._imageDir = './public/image/profile/';
    }

    /**
     * Returns a list of profile image URLs
     */
    async getImages() {
        var images = fs.readdirSync(this._imageDir);
        for(var i = 0; i < images.length; i++) {
            images[i] = '/resource/image/profile/' + images[i];
        }
        return images;
    }
}