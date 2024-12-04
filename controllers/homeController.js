const userModel = require("../models/User");
const demandModel = require("../models/demand");
const advertisementModel=require("../models/advertisement");

function currentDate() {
    const currentDate = new Date();
    const istOffset = 5 * 60 + 30; 
    const istTime = new Date(currentDate.getTime() + istOffset * 60 * 1000);
    const formattedDate = istTime.toISOString().split('T')[0];
    const istTimeString = istTime.toISOString().split('T')[1].split('.')[0];

    return {
        date: formattedDate,
        time: istTimeString,
        fullDateTime: `${formattedDate} ${istTimeString}`
    };
}

exports.home=async(req,res)=>{
    const userId=req.user;
    if(!userId) return res.status(400).json({message:"No account Exists"});
    const istDateTime = currentDate();
    try {
        const userData=await userModel.findOne({userId}).select("firstName lastName _id profilePicture userId preference verificationStatus");
        console.log(userData);

        //const demandDocuments=await demandModel.countDocuments();
        
        const demandDocuments = await demandModel.countDocuments({
            Expiry: { $gte: istDateTime.date }
        });
        console.log(demandDocuments)
        res.status(200).json({user:userData, totalDemands:demandDocuments,success:true});   
    } catch (error) {
        return res.status(500).json({ message: "Failed to Fetch data", success: false });
    }
};

exports.getAllAdvertisements = async (req, res) => {
    try {
        const ads = await advertisementModel.find();
        if (!ads || ads.length === 0) {
            return res.status(404).json({
                message: "No ads found",
                success: false
            });
        }

        const allImageUrls = ads.flatMap(ad => ad.adImages);

        res.status(200).json({
            success: true,
            imageUrls: allImageUrls
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            success: false
        });
    }
};
