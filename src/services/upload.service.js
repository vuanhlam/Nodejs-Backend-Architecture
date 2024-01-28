'use strict'

const cloudinary  = require('../configs/cloudinary.config');

//1. upload from url image
const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmso4nq0cixr12';

        const folderName = 'product/shopId'
        const newFileName = 'testdemo12' // nếu không khai báo file name thì sẽ tự động generate tên ngẫu nhiên

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

//2. upload image from local
const uploadImageFromLocal = async ({
    path,
    folderName = 'product/8409'
}) => {
    try {

        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName
        })

        return {
            image_url: result.secure_url,
            shopId: 8409,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            })
        }
    } catch (error) {
        
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal
}
