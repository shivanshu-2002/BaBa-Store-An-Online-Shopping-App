const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");
const {uploadImageToCloudinary} = require('../utils/imageUploader')


exports.addProducts = async (req, res) => {
  try {
    const user = req.user.id;
    const {
      productName,
      productDescription,
      discounts,
      price,
      category // which is id
    } = req.body;

    // You may need to handle file uploads for the thumbnail here
    const thumbnail = `https://api.dicebear.com/5.x/initials/svg?seed=Product`;

    if (!productName || !productDescription || !discounts || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields"
      });
    }

    const product = await Product.create({
      productName,
      productDescription,
      seller: user,
      discounts,
      ratingAndReviews: [],
      price,
      thumbnail,
      category
    });

    // Add Product to Category also...
    const resp = await Category.findByIdAndUpdate(
      { _id: category },
      { $push: { product: product._id } }
    );

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      product
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Can't add Products"
    });
  }
};

exports.buyProducts = async (req, res) => {
  try {

    const userId = req.user.id;
    const { productId } = req.body; // Assuming your request body contains a "productId"

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required.",
      });
    }

    // Find the user by ID and update the "products" array with the new product ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { products: productId },
      },
      { new: true } // This option ensures you get the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product purchased successfully.",
      user: updatedUser, // You can send the updated user data if needed
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


exports.getSomeProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 30 } },
    ]);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      success: false,
      message: "Can't find your products.",
    });
  }
};


exports.getProductDetails = async (req, res) => {
  try {
    const { productId } = req.query;
    //  Validate the CourseId ...
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId cant be null"
      })
    }
    // get the details
    const productDetails = await Product.findById(productId).
      populate({
        path: "seller",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews").exec();

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "No Course found"
      })
    }

    const product_category = productDetails.category;
    const related_products = await Product.find({ category: product_category }).populate({
      path: "seller",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews").exec();;
    const filtered_related_products = related_products.filter(product => product._id.toString() !== productId);

    return res.status(200).json({
      success: true,
      message: "Here is you courseDetails",
      productDetails,filtered_related_products
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "Cant get Details"
    })
  }
}


// exports.updateProducts = async (req, res) => {
//   try {
//     const obj = req.body;
//     let displayPictures;
//     if(req.files!=null){
//       displayPictures = req.files.product;
//     }

//     if (!obj.obj) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid Product ID"
//       });
//     }

//     let upimage;
    
//     if (displayPictures) {
//       upimage = await uploadImageToCloudinary(displayPictures, process.env.FOLDER);
//     }

//     const updateFields = {};

//     if (upimage) {
//       updateFields.thumbnail = upimage.secure_url;
//     }

//     if (obj.productName) {
//       updateFields.productName = obj.productName;
//     }
//     if (obj.productDescription) {
//       updateFields.productDescription = obj.productDescription;
//     }
  
//     const updatedProduct = await Product.findByIdAndUpdate(
//       { _id: obj.obj },
//       { $set: updateFields },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Product Updated Successfully",
//       updatedProduct
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       error: "Internal server error"
//     });
//   }
// };

exports.updateProducts = async (req, res) => {
  try {
    const obj = req.body;
    let productImages = req.files.product; // Ensure it's an array

    if (!Array.isArray(productImages)) {
      // If it's not an array, convert it to an array with a single element
      productImages = [productImages];
    }

    if (!obj.obj) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Product ID"
      });
    }

    let updatedImages = [];

    if (productImages) {
      // Upload each product image to Cloudinary
      for (const image of productImages) {
        const upimage = await uploadImageToCloudinary(image, process.env.FOLDER);
        updatedImages.push(upimage.secure_url);
      }
    }

    const updateFields = {};

    if (updatedImages.length > 0) {
      updateFields.$push = { thumbnail: { $each: updatedImages } }; // Use $push to add new images
    }

    if (obj.productName) {
      updateFields.productName = obj.productName;
    }
    if (obj.productDescription) {
      updateFields.productDescription = obj.productDescription;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: obj.obj },
      updateFields, // Use $push here
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      updatedProduct
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
