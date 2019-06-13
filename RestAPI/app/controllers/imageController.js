var ImageFacade = require('../facades/imageFacade');
var ApiResponse = require('../models/contracts/apiResponse');

exports.getImages = (req, res, next) => {
    var facade = new ImageFacade();
    facade.getImages().then((images) => {
        if(images) {
            return res.status(200).json(new ApiResponse(true, 'Loaded images', images));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not load images', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}