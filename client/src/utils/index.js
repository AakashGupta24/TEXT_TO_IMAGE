import {surpriseMePrompts} from '../constants';
import Filesaver from 'file-saver';
export function getRandomPrompt(prompt){
    const randomIndex = Math.floor(Math.random()* surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[randomIndex];
    if(randomPrompt === prompt) return getRandomPrompt(prompt)
    return randomPrompt;
}

export async function downloadImage(_id,photo){
  
    let getType = String(photo)
    if (getType.endsWith('gif')) {
        Filesaver.saveAs(photo,`download-${_id}.gif`);
    }else{
        Filesaver.saveAs(photo,`download-${_id}.jpg`);
    }
}