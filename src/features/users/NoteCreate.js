import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateNoteMutation } from "./NoteApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import { Link } from "react-router-dom";
import "./styles.css";

import Header from "../../components/Header";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

const CreatePost = () => {
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
      count: 0,
      countExp: 0,
      tag: [],
      done: false,
      files: [],
      isListening: false, // Added state to handle voice recognition
    },
  ]);

  function findInStr (transcript, index) {
    let arrindexkey = {}
    for ( let i of ['title' , 'count' , 'countExp','tag']){
      if(transcript.toLocaleLowerCase().includes(i)){
        arrindexkey[i] = transcript.indexOf(i)
      }
    }
    console.log(arrindexkey)
    const keyI = Object.keys(arrindexkey)
    if (keyI.length >= 1 ){
      for(let n = 1  ; n<= keyI.length; n++){
        console.log(transcript.substring(arrindexkey[keyI[n-1]]+ (keyI[n-1]?.length) || 0,arrindexkey[keyI[n]] ));
        console.log(keyI[n-1]?.length)
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
        count: 0,
        countExp: 0,
        tag: "",
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
          formData.append(`notes[${index}][countExp]`, note.countExp);
          formData.append(`notes[${index}][done]`, note.done);
          formData.append(`notes[${index}][tag]`, note.tag);
          note.files.forEach((file) => {
            formData.append(`notes[${index}][files]`, file);
          });
        });

        console.log(notes);
        console.log(formData);

        await createNote({
          formData,
        }).unwrap();
        setNotes([
          {
            title: "",
            expTime: formattedDate,
            count: 0,
            countExp: 0,
            tag: [],
            done: false,
            files: [],
            isListening: false,
          },
        ]);
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
            <div key={index}>
              <label htmlFor={`postTitle-${index}`}>Food name:</label>
              <input
                type="text"
                id={`postTitle-${index}`}
                name={`postTitle-${index}`}
                value={note.title}
                onChange={(e) => handleInputChange(index, "title", e.target.value)}
              />
              <button
                type="button"
                onClick={() => toggleListening(index)}
              >
                {note.isListening ? "Stop Listening": "Start Listening"}
                {(console.log(note.isListening))}
              </button>
              <label htmlFor={`postExpTime-${index}`}>ExpTime:</label>
              <input
                type="date"
                id={`postExpTime-${index}`}
                name={`postExpTime-${index}`}
                value={note.expTime}
                onChange={(e) => handleInputChange(index, "expTime", e.target.value)}
              />
              <label htmlFor={`postCount-${index}`}>Count:</label>
              <input
                type="number"
                id={`postCount-${index}`}
                name={`postCount-${index}`}
                value={note.count}
                onChange={(e) => handleInputChange(index, "count", Number(e.target.value))}
                max="999"
                min="0"
              />
              <label htmlFor={`postCountExp-${index}`}>CountExp:</label>
              <input
                type="number"
                id={`postCountExp-${index}`}
                name={`postCountExp-${index}`}
                value={note.countExp}
                onChange={(e) => handleInputChange(index, "countExp", Number(e.target.value))}
                max="999"
                min="0"
              />
              <label htmlFor={`postTag-${index}`}>Tag:</label>
              <input
                type="text"
                id={`postTag-${index}`}
                name={`postTag-${index}`}
                value={note.tag}
                onChange={(e) => handleInputChange(index, "tag", (e.target.value.includes(",") ? e.target.value.split(",") : e.target.value))}
              />
              <label htmlFor={`postDone-${index}`}>Exp?:</label>
              <input
                type="checkbox"
                id={`postDone-${index}`}
                name={`postDone-${index}`}
                checked={note.done}
                onChange={(e) => handleInputChange(index, "done", e.target.checked)}
              />
              <label htmlFor={`postFiles-${index}`}>Upload Images:</label>
              <input
                type="file"
                id={`postFiles-${index}`}
                name={`postFiles-${index}`}
                multiple
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
              
              {index > 0 && (
                <button type="button" onClick={() => handleRemoveNote(index)}>
                  Remove
                </button>
              )}
              <button type="button" onClick={() => handleRemoveImage(index)}>
                Remove Image
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddNote}>
            Add Another Note
          </button>
          <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
            Save Post
          </button>
        </form>
      </section>
    </div>
  );
};

export default CreatePost;
