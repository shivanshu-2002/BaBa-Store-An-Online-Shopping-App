const Category = require("../models/Category");
const {uploadImageToCloudinary} = require('../utils/imageUploader')

exports.createCategory = async(req,res)=>{
         try{
          const {name , description}  =req.body;
          if(!name || !description){
                 return res.status(400).json({
                      success:false,
                      message:"ALl fields required"

                 })
          }

          const newCategory = Category.create({
                 name,
                 description
          })
          console.log(newCategory);

          return res.status(200).json({
            success:true,
            message:"Successfully Created Category",
            newCategory
          })
         }catch{
            return res.status(500).json({
              success:false,
              message:"Cant Create New Cateogry"
            })
         }
}

exports.showAllCategory = async (req,res)=>{
      try{
          const allCategory = await Category.find({},{name:true,description:true,image:true});
          res.status(200).json({
               success:true,
               allCategory,
               message:"Here is your all Category"
          })
      } catch(error){
        console.log(error);
        return res.status(500).json({
             success:false,
             message:"Cant fetchh all Category"
        })
      }
}

// Category detail page ka handler function create kro ...
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.query;
    console.log(categoryId)
    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate("product")
      .exec()
      console.log("selectedCategory",selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
   return  res.status(200).json({
      success: true,
      data: {
        selectedCategory,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const obj = req.body;
    let displayPictures;
    if(req.files!=null){
      displayPictures = req.files.category;
    }

    if (!obj.obj) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Category ID"
      });
    }

    let upimage;
    
    if (displayPictures) {
      upimage = await uploadImageToCloudinary(displayPictures, process.env.FOLDER);
    }

    const updateFields = {};

    if (upimage) {
      updateFields.image = upimage.secure_url;
    }

    if (obj.name) {
      updateFields.name = obj.name;
    }
    if (obj.description) {
      updateFields.description = obj.description;
    }
  
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: obj.obj },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      updatedCategory
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
