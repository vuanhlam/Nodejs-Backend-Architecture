'use strict'

const cloudinary  = require('../configs/cloudinary.config');

//1. upload from url image

const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/bb6b6081ca580b29015b003783525fe3';

        const folderName = 'product/shopId'
        const newFileName = 'testdemo' // nếu không khai báo file name thì sẽ tự động generate tên ngẫu nhiên

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName
        })

        console.log(result);

        return result
    } catch (error) {
        console.error(error);   
    }
}


module.exports = {
    uploadImageFromUrl
}
