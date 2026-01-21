import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
// eslint-disable-next-line
import * as faceapi from "face-api.js";
import "./StudentRegistration.css";

export default function FacultyRegistration() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState("");
  const [faceError, setFaceError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  /* ================= FACE STATE ================= */
  const [cameraOn, setCameraOn] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const departments = ["AI&DS", "AI&ML", "ASE", "CSE", "ECE", "Civil", "Mech"];

  /* ================= LOAD MODELS ================= */
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validatePassword = (p) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,15}$/.test(p);

  /* ================= FACE CAPTURE ================= */
  const captureFace = async () => {
    setFaceError("");

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setFaceError("Failed to capture image");
      return;
    }

    const img = new Image();
    img.src = imageSrc;

    img.onload = async () => {
      const detections = await faceapi
        .detectAllFaces(
          img,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        setFaceError("No face detected. Please face the camera.");
        return;
      }

      if (detections.length > 1) {
        setFaceError("Multiple faces detected. Only one person allowed.");
        return;
      }

      setCapturedImage(imageSrc);
      setFaceDescriptor(Array.from(detections[0].descriptor));
      setFaceCaptured(true);
      setCameraOn(false);
      setFaceError("");
    };
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!validatePassword(formData.password))
      return setErrors("Weak password");

    if (formData.password !== formData.confirmPassword)
      return setErrors("Passwords do not match");

    if (!faceDescriptor)
      return setErrors("Please capture your face");

    const res = await fetch("http://localhost:5000/api/faculty/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, faceDescriptor }),
    });

    const data = await res.json();
    if (!res.ok) return setErrors(data.message);

    // ✅ REDIRECT TO FACULTY LOGIN
    navigate("/faculty-login");
  };

  return (
    <div className="reg-container">
      <div className="reg-card">

        <div className="reg-left">
          <img src="/registration-illustration.jpg" alt="illustration" />
        </div>

        <div className="reg-right">
          <div className="reg-box">
            <h2>Faculty Registration</h2>
            {errors && <p className="error">{errors}</p>}

            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Full Name" onChange={handleChange} required />

              <select name="department" onChange={handleChange} required>
                <option value="">Department</option>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>

              {/* ✅ DESIGNATION AS INPUT */}
              <input
                name="designation"
                placeholder="Designation"
                onChange={handleChange}
                required
              />

              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
              <input name="phone" placeholder="Phone Number" onChange={handleChange} required />

              <div className="pass-wrapper">
                <input type={showPass ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} />
                <span className="eye-icon" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="pass-wrapper">
                <input type={showConfirmPass ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
                <span className="eye-icon" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                  {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* FACE AUTH */}
              <div className="face-auth-box">
                {!faceCaptured && (
                  <button type="button" disabled={!modelsLoaded} onClick={() => setCameraOn(true)}>
                    Capture Face
                  </button>
                )}

                {cameraOn && (
                  <>
                    <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="face-webcam" />
                    <button type="button" onClick={captureFace}>Capture Image</button>
                  </>
                )}

                {faceCaptured && (
                  <>
                    <img src={capturedImage} className="face-preview" alt="captured" />
                    <button type="button" onClick={() => {
                      setFaceCaptured(false);
                      setCapturedImage(null);
                      setFaceDescriptor(null);
                      setCameraOn(true);
                    }}>
                      Re-Capture
                    </button>
                  </>
                )}

                {faceError && <p className="error">{faceError}</p>}
              </div>

              <button type="submit">Create Account</button>
            </form>

            <p className="login-text">
              Already Registered? <a href="/faculty-login">Login</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
