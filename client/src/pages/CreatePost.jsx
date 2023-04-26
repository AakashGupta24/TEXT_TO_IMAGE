import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import {FaMicrophone} from 'react-icons/fa'


const CreatePost = () => {

  const { transcript, browserSupportsSpeechRecognition,resetTranscript } = useSpeechRecognition()

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
const [photo, setPhoto] = useState("Image");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startSpeaking, setStartSpeaking] = useState("startSpeaking");
  
const selected=()=>{
  if (photo ==='Image') {
    setPhoto('GIF');
  }else{
    setPhoto('Image');
  }
}


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateText = (e) =>{
    if (!browserSupportsSpeechRecognition) {
      return null
  }
  if (startSpeaking === 'startSpeaking'){
    if (form.prompt === ''){
  resetTranscript()
    }
   
    const start = () => {SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    // setForm({ ...form, prompt: transcript });
    
  }
    start()
    setStartSpeaking('stopSpeaking')
  }
  else if (startSpeaking === 'stopSpeaking'){
    SpeechRecognition.stopListening()
    setForm({ ...form, prompt: transcript });
    setStartSpeaking('startSpeaking')
  }
  }

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  };

  const generateGif = async() =>{
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/giphy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        // console.log(data);+
        setForm({ ...form, photo:data.photo});
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image through TEXIM AI and share it with the community</p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={form.name}
            handleChange={handleChange}
          />
<div className="flex gap-5 cursor-pointer">
<div className={`font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md hover:bg-blue-800 `}>{photo}
</div>
<div className={`font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md hover:bg-blue-800 }`}
onClick={()=>{
selected();
}}>Click to change type</div>
</div>

  <div className=''>
    
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            microphone
            generateText={generateText}
            handleSurpriseMe={handleSurpriseMe}
          />
          
          </div>
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={photo ==='Image' ?generateImage : generateGif}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;