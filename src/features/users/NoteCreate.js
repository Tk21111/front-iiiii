import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateNoteMutation } from "./NoteApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import { Link } from "react-router-dom";
import "./styles.css";

import Header from "../../components/Header";
import { translate } from "../../hooks/translator";
import { tagList } from "./comp/menu";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

const CreateNote = () => {
  const navigate = useNavigate();
  const username = useSelector(selectCurrentUser);

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  //speech to text save value 
  const [spc , setSpc] = useState('')
  const [createNote, { isLoading }] = useCreateNoteMutation();
  const [notes, setNotes] = useState([
    {
      title: "",
      expTime: formattedDate,
      count: null,
      countExp: null,
      tag: [],
      typeCount : 'kg',
      done: false,
      files: [],
      isListening: false, // Added state to handle voice recognition
    },
  ]);

  function findInStr (transcript, index) {
    //set bare str to obj element 
    let arrindexkey = {}
    //set {key}
    for ( let i of ['title' , 'count' , 'countExp','tag']){
      if(transcript.toLocaleLowerCase().includes(i)){
        arrindexkey[i] = transcript.indexOf(i)
      }
    }
    console.log(arrindexkey)
    const keyI = Object.keys(arrindexkey)
    //in case of more than 1 key //ok fine idk what is this
    if (keyI.length >= 1 ){
      for(let n = 1  ; n<= keyI.length; n++){
        console.log(transcript.substring(arrindexkey[keyI[n-1]]+ (keyI[n-1]?.length) || 0,arrindexkey[keyI[n]] ));
        console.log(keyI[n-1]?.length)
        //
        handleInputChange(index, keyI[n-1] , transcript.substring(arrindexkey[keyI[n-1]]+ (keyI[n-1]?.length) || 0,arrindexkey[keyI[n]] ));
      };
      
    }else{
      handleInputChange(index, keyI[0], transcript);
    }
    
  };

  const handleListen = (index) => {
    const note = notes[index];
    try{
        if (note.isListening) {
            if (!mic.isRecognizing) {
              mic.start();
              mic.isRecognizing = true;  // Add a flag to track recognition status
            }
            
            
            mic.onend = () => {
              console.log("continue..");
              
            };
            
          } else {
            //causing bug cause it not working //fix try catch
            mic.stop();
            mic.onend = () => {
              console.log("Stopped Mic on Click");
              mic.isRecognizing = false;
            };
          }
        
          mic.onstart = () => {
            console.log("Mics on");
          };
        
          mic.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map((result) => result[0])
              .map((result) => result.transcript)
              .join("");
            console.log(transcript);
            setSpc(transcript);
            findInStr(transcript , index)
          };
        
          mic.onerror = (event) => {
            console.log(event.error);
          };
    }catch{
        console.log("slow down")
    }
    
  };
  

  useEffect(() => {
    notes.forEach((note, index) => {
      if (note.isListening) {
        handleListen(index);
      }
    });
  }, [notes]);
  

  if (isLoading) return <p>Loading...</p>;

  const canSave = notes.every(
    (note) =>
      [note.title, note.expTime, note.tag].every(Boolean) &&
      !isLoading &&
      note.count >= 0 &&
      note.countExp >= 0
  );

  const handleInputChange = (index, field, value) => {
    const updatedNotes = notes.map((note, i) =>
      i === index ? { ...note, [field]: value } : note
    );
    setNotes(updatedNotes);
  };

  const handleFileChange = (index, files) => {
    const fileArray = Array.from(files);
    const updatedNotes = notes.map((note, i) =>
      i === index
        ? {
            ...note,
            files: fileArray,
            preview: fileArray.map((file) => URL.createObjectURL(file)),
          }
        : note
    );
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    setNotes([
      ...notes,
      {
        title: "",
        expTime: formattedDate,
        count: null,
        countExp: null,
        tag: "",
        typeCount : 'kg',
        done: false,
        files: [],
        isListening: false,
      },
    ]);
  };

  const handleRemoveNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const handleRemoveImage = (index) => {
    const updatedNotes = notes.map((note, i) => {
      if (i === index) {
        return { ...note, files: [], preview: [] };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const toggleListening = (index) => {
    const updatedNotes = notes.map((note, i) => {
      if (i === index) {
        if (note.isListening) {
          mic.stop(); // Stop immediately if it's listening
          mic.isRecognizing = false;
        }
        return { ...note, isListening: !note.isListening };
      }
      return note;
    });
    setNotes(updatedNotes);
  };
  
 


  const onSavePostClicked = async () => {
 
      
      if (canSave) {
        try {
          const formData = new FormData();
          notes.forEach((note, index) => {
            formData.append(`notes[${index}][username]`, username);
            formData.append(`notes[${index}][text]`, note.title);
            formData.append(`notes[${index}][date]`, note.expTime);
            formData.append(`notes[${index}][count]`, note.count);
            formData.append(`notes[${index}][countExp]`, note.countExp || 0);
            formData.append(`notes[${index}][typeCount]`, note.typeCount);
            formData.append(`notes[${index}][done]`, note.done);
            formData.append(`notes[${index}][tag]`, note.tag);
            note.files.forEach((file) => {
              formData.append(`notes[${index}][files]`, file);
            });
          });
  
          
  
          await createNote({
            formData,
          }).unwrap();

          /*
          setNotes([
            {
              title: "",
              expTime: formattedDate,
              count: null,
              countExp: null,
              tag: [],
              typeCount : 'kg',
              done: false,
              files: [],
              isListening: false,
            },
          ]);
          */
          navigate(`/user`);
          
        } catch (err) {
          console.error("Failed to save the post", err);
          if (err.originalStatus === 409) {
            navigate(`/user/note/edit/${err.data.noteId}`);
          } else if (err.name === "TypeError" && err.message === "Failed to fetch") {
            console.error("Network or CORS error: ", err);
          } else {
            console.error("Unexpected error: ", err);
          }
        }
      
    }
    
  };

  return (
    <div className="page">
      <Header/>
      <section>
      <div className='content' >
         <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
          <p style={{ marginRight : 'auto'}} className='welcomefont'>create note</p>
        </div>
        <div className='content' style={{backgroundColor : '#FFE3E3' }} >
          <p className='welcomefont' style={{color: 'black'}}>{spc || "speech to text "}</p>
        </div>
        <form>
          {notes.map((note, index) => (
            <div style={{borderRadius : '2vi' , border : '1px solid black' , marginTop : '2vi' , padding : '2vi'}}>
            <form key={index}>
              {index > 0 && (
                <button className='buttonCF'style={{width : '10%' , alignSelf : 'end'}} type="button" onClick={() => handleRemoveNote(index)}>
                X
                </button>
              )}
              <label htmlFor={`postTitle-${index}`} className='welcomefont'>{translate('foodName') + " : "}</label>
              <input
                type="text"
                style={{marginTop: '2%'}}
                id={`postTitle-${index}`}
                name={`postTitle-${index}`}
                value={note.title}
                onChange={(e) => handleInputChange(index, "title", e.target.value)}
              />
              <button
                type="button"
                style={{marginTop : '5%' , marginBottom: '5%'}}
                className='buttonCF'
                onClick={() => toggleListening(index)}
              >
                {note.isListening ? "Stop Listening": "Start Listening"}
                {(console.log(note.isListening))}
              </button>
              <label htmlFor={`postExpTime-${index}`} className='welcomefont'>{translate('expDate') + " : "}</label>
              <input
                type="date"
                style={{marginTop: '2%'}}
                id={`postExpTime-${index}`}
                name={`postExpTime-${index}`}
                value={note.expTime}
                onChange={(e) => handleInputChange(index, "expTime", e.target.value)}
              />
              <label htmlFor={`postCount-${index}`} className='welcomefont'>{translate('count') + " : "}</label>
              <input
                type="number"
                style={{marginTop: '2%'}}
                id={`postCount-${index}`}
                name={`postCount-${index}`}
                value={note.count}
                onChange={(e) => handleInputChange(index, "count", Number(e.target.value))}
                max="999"
                min="0"
              />
              <label htmlFor={`postCountExp-${index}`} className='welcomefont'>{translate('countExp') + " : " }</label>
              <input
                type="number"
                style={{marginTop: '2%'}}
                id={`postCountExp-${index}`}
                name={`postCountExp-${index}`}
                value={note.countExp}
                onChange={(e) => handleInputChange(index, "countExp", Number(e.target.value))}
                max="999"
                min="0"
              /> 
              <label htmlFor={`postCountExp-${index}`} className='welcomefont'>{translate('typeCount') + " : " }</label>
              <select
                  value={note.countExp?.typeCount}
                  onChange={(e) => handleInputChange(index, 'typeCount', e.target.value)}
                  required
                  style={{height : "4vh"  , marginLeft : '1vh' ,marginRight : '1vh', paddingTop: '0.45vi'}}
              >
                {tagList.map(p => p)}
              </select>
              <div className="icon-container">
                <label htmlFor={`postTag-${index}`} className='welcomefont'>{translate('tag') + " : "}</label>
                <input
                  type="text"
                  style={{marginTop: '2%'}}
                  id={`postTag-${index}`}
                  name={`postTag-${index}`}
                  value={note.tag}
                  onChange={(e) => handleInputChange(index, "tag", (e.target.value.includes(",") ? e.target.value.split(",") : e.target.value))}
                />
                <div className="hover-description">{"parent || เซ็ตใหญ่ ex เป็ดเยอรมัน => เป็ด"}</div>
              </div>
              {/* */}
              <label htmlFor={`postFiles-${index}`} className='welcomefont'>{translate('upLoadImage') + " : "}</label>
              <input
                type="file"
                accept="image/*"
                id={`postFiles-${index}`}
                name={`images`}  // Changed this line
                multiple
                disabled={true}
                onChange={(e) => handleFileChange(index, e.target.files)}
              />

              <div>
                {note?.preview?.map((src, fileIndex) => (
                  <img
                    key={fileIndex}
                    src={src}
                    alt={`preview-${fileIndex}`}
                    style={{
                      flexGrow: 1,
                      maxWidth: 200,
                      maxHeight: 200,
                      borderBlockWidth: 1,
                      borderRadius: 25,
                    }}
                  />
                )) || "no image"}
              </div>
              
              <button type="button" onClick={() => handleRemoveImage(index)}>
                {translate('deleteImg')}
              </button>
            </form>
            </div>
          ))}
          <button className="buttonCF" style={{marginTop : '5vi' , color : '#F9AEFF' , backgroundColor : '#FFF6A6'}} type="button" onClick={handleAddNote} disable={isLoading}>
            {translate('addMore')}
          </button>
          
          <button className="buttonCF-save"  type="button" onClick={onSavePostClicked} disabled={!canSave || isLoading}>
            {translate('save')}
          </button>
        
          
        </form>
        
      </section>
    </div>
  );
};

export default CreateNote;
