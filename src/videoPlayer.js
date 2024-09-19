import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const VideoPlayer = () => {
  const videoRef = useRef(null); 
  const [showPopup, setShowPopup] = useState(false); 
  const [user , setuser] = useState();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    mobile: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false); 

  useEffect(() => {
    const video = videoRef.current;

    
    const handleTimeUpdate = () => {
      console.log("Video time:", video.currentTime);
      if (video.currentTime >= 10 && !showPopup  && !user ) {
        console.log("Pausing video and showing popup");
        video.pause(); 
        setShowPopup(true); 
      }
    };

    
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [showPopup]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form data", userData);
      const video = videoRef.current;
     
      const res =  await axios.post("http://localhost:5000/api/user", userData);
      alert("Data saved successfully!");
      
      console.log(res.data)
      if(res.data.success){
        setuser(res.data.user)
       await  video.play()
      }

      
      setShowPopup(false);
      setIsSubmitted(true);

      
      if (videoRef.current) {
        console.log("Resuming video");
        videoRef.current.play(); 
      }
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  return (
    <div>
      
      <video ref={videoRef} width="600" controls>
        <source src="video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      
      {showPopup && !isSubmitted && (
        <div className="popup" style={popupStyle}>
          <div className="popup-content" style={popupContentStyle}>
            <h2>User Details</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  required
                />
              </label>
              <br />
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <br />
              <label>
                Mobile:
                <input
                  type="text"
                  name="mobile"
                  value={userData.mobile}
                  onChange={handleChange}
                  required
                />
              </label>
              <br />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


const popupStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "300px",
  textAlign: "center",
};

export default VideoPlayer;
