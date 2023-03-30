import express  from "express";
import * as dotenv from  'dotenv';
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

router.route('/').get((req,res)=>{
    res.send('gsajbdskjbcj hhk j');
});

const APIKEY = process.env.VITE_GIPHY_API

router.route('/').post(async(req,res)=>{
    const {prompt} = req.body;
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${prompt.split(" ").join("")}&limit=1`);
        const {data} = await response.json();
        const gif = data[0]?.images?.downsized_medium.url;
        // return gif
        res.status(200).json({photo:gif});
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }



})

export default router;