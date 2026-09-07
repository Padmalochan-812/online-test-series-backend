import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Test_Series } from "../models/test_series.model.js";

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

const UpdateTestSeries = asyncHandler( async (req, res) => {
    const { name, description, price, discountPrice } = req.body

    if(
        [ name, description, price, discountPrice ].some((field) => field?.trim() === "" )
    ) {
        throw new apiError (400, "All fields are required !")
    }

    const test_series = await Test_Series.findByIdAndUpdate(
        req.test_series.id,
        {
            $set:{
                name,
                description,
                price,
                discountPrice,
                percentage: percentage
            }
        },
        {
            returnDocument: "after"
        }
        

    )

    if(!test_series){
        throw new apiError( 401, "test series not update")
    }
    
    return res.status(200).json(
        new apiResponse(200, test_series, "test series Details update successful")
    )
    

})

const UpdateBanner = asyncHandler(async (req, res) => {
    const bannerLocalPath = req.file?.path
    if(!bannerLocalPath) {
        throw new apiError(401, "Banner local path is required !")
    }

    const banner = await uploadOnCloudinary(bannerLocalPath)
    if(!banner) {
        throw new apiError(401, "error while uploading banner !")
    }

    const test_series = await Test_Series.findByIdAndUpdate(
        req.test_series?._id,
        {
            $set:{
                banner: banner.url
            }
        },
        {
            returnDocument: "after"
        }
    )

    return res.status(200).json(
        new apiResponse( 200, test_series, "Banner Image updated successfully ")
    )
})

const GetAllTestSeries = asyncHandler ( async (req, res) => {
    const test_series = await Test_Series.find({})
    if( test_series.length ==0 ){
        throw new apiError (401, "No test series")
    }
    
    return res.status(200).json(
        new apiResponse(
            200,
            test_series,
            "All test series fetched successfully "
        )
    )
})

const GetTestSeriesById = asyncHandler( async( res, res) => {
    const test_seriesId = req.params._id

    const test_series = await Test_Series.findById(test_seriesId)

    if(!test_series) {
        throw new apiError (401, " test series not found !")
    }

    return res.status(200).json(
        new apiResponse(200, test_series, "Test Series fetched successfully")
    )
})

export {
    CreateTestSeries,
    UpdateTestSeries,
    UpdateBanner,
    GetAllTestSeries,
    GetTestSeriesById
}