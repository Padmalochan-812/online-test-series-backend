import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const CreateTestSeries = asyncHandler (async (req, res) =>{
    const {name, description, price, discountPrice } = req.body

    if(
        [ name, description, price, discountPrice ].some((field) => field?.trim() === "" )
    ) {
        throw new apiError (400, "All fields are required !")
    }

    const bannerLocalPath = req.file?.path;

    const banner = await uploadOnCloudinary(bannerLocalPath || "");

    const percentage = (((price-discountPrice)/price)*100)

    const test_series = await Test_Series.create({
        name,
        description,
        price,
        discountPrice,
        banner: banner?.url || "",
        percentage: percentage
    
    })

    if(!test_series) {
        throw new apiError(500, "Something Went Wrong while create test series  ")
    }

    return res.status(200)
    .json(200, test_series ,"test series create successfully")

})