import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Test_Series } from "../models/test_series.model.js";

const CreateTestSeries = asyncHandler (async (req, res) => {
    const {title, description, price, discountPrice } = req.body;

    if(
        [ title, description, price, discountPrice ].some((field) => field?.trim() === "" )
    ) {
        throw new apiError (400, "All fields are required !")
    }

    const bannerLocalPath = req.file?.path;

    const banner = await uploadOnCloudinary(bannerLocalPath || "");

    const percentage = (((price-discountPrice)/price)*100)
    
    const test_series = await Test_Series.create({
        title,
        description,
        price,
        discountPrice,
        banner: banner?.url || "",
        percentage: percentage
        
    
    })

    if(!test_series) {
        throw new apiError(500, "Something Went Wrong while create test series  ")
    }

    return res
    .status(200)
    .json(new apiResponse (200, test_series ,"test series create successfully"))

})

const UpdateTestSeries = asyncHandler( async (req, res) => {
    const { title, description, price, discountPrice } = req.body

    if ( !title?.trim() || !description?.trim() || price === undefined || discountPrice === undefined) {
        throw new apiError(400, "All fields are required!");
    }
    
    
    const percentage = (((price-discountPrice)/price)*100)
    
    const {id} = req.params
    
    const test_series = await Test_Series.findByIdAndUpdate(
        id,
        
        {
            $set:{
                title,
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

    
    const bannerLocalPath = req.file?.path;


    if(!bannerLocalPath) {
        throw new apiError(401, "Banner local path is required !")
    }

    const banner = await uploadOnCloudinary(bannerLocalPath)
    if(!banner) {
        throw new apiError(401, "error while uploading banner !")
    }
    const {id} = req.params
    console.log(id)
    const test_series = await Test_Series.findByIdAndUpdate(
        id,
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

const GetTestSeriesById = asyncHandler( async( req, res) => {
    const {id} = req.params
    

    const test_series = await Test_Series.findById(id)

    if(!test_series) {
        throw new apiError (401, " test series not found !")
    }

    return res.status(200).json(
        new apiResponse(200, test_series, "Test Series fetched successfully")
    )
})
const deleteTestSeries = asyncHandler( async(req, res) => {
    const {id} = req.params
    const test_series = await Test_Series.findById(id)

    if(!test_series) {
        throw new apiError (401, " test series not found !")
    }

    await Test_Series.findByIdAndDelete(id)
    
    return res
    .status(200)
    .json(new apiResponse(200, "", "test series deleted successfully"))
})

export {
    CreateTestSeries,
    UpdateTestSeries,
    UpdateBanner,
    GetAllTestSeries,
    GetTestSeriesById,
    deleteTestSeries
}