import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';
import giphyRoutes from './routes/giphyRoutes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit:'50mb'}));

app.use('/api/v1/post',postRoutes);
app.use('/api/v1/dalle',dalleRoutes);
app.use('/api/v1/giphy',giphyRoutes);


app.get('/',async(req,res)=>{
    res.send('hello from openai');
})

const startServer = async () =>{
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8080,()=>console.log('server is running'));
    } catch (error) {
        console.log(error);
    }
}
startServer();