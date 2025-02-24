import Image from "../models/image.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../helpers/cloudinary-helper.js";
import fs from "fs/promises";

export const uploadImage = async (req, res) => {
  try {
    //Check if file exists in request
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    //Upload to cloudinary
    const uploadedFiles = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.path))
    );

    //Store the image url and public Id along with the userId in database

    const dBuploadedImages = await Promise.all(
      uploadedFiles.map((file) =>
        Image.create({
          url: file.url,
          publicId: file.publicId,
          uploadedBy: req.user.userId,
        })
      )
    );

    //Delete the locally stored image after uploading to cloudinary

    await Promise.all(req.files.map((file) => fs.unlink(file.path)));

    // fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Uploaded successfully",
      data: dBuploadedImages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
};

export const deleteImgs = async (req, res) => {
  try {
    //Check if the user is authenticated and the image IDs are provided
    const { userId } = req.user;
    const { publicIds } = req.body; //Expect an array of ids

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to perform this action",
      });
    }
    if (!publicIds || !publicIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide the public Ids of the images",
      });
    }

    //Delete the images from cloudinary using the provided array of public Ids
    const result = await deleteFromCloudinary(publicIds);
    console.log(result);

    //Check if there any unsuccessful deletions
    const notFoundIds = Object.entries(result.deleted)
      .filter(([_, status]) => status === "not_found")
      .map(([id]) => id);
    if (notFoundIds.length > 0) {
      return res.status(404).json({
        success: false,
        message: "One or more images are non existent",
      });
    }

    //Delete the images from the databse using the result from cloudinary
    const deleteFromDB = Object.entries(result.deleted).map((publicId) =>
      Image.findOneAndDelete({ publicId, uploadedBy: userId })
    );

    const dbResponse = await Promise.all(deleteFromDB);

    //Return the results
    return res.status(200).json({
      success: true,
      message: "Deleted images successfully",
      data: dbResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
