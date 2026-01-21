import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function FaceVerifyModal({ onSuccess, onClose }) {
  const webcamRef = useRef(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  /* ===============================
     LOAD MODELS (SSD ONLY)
  =============================== */
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

  /* ===============================
     VERIFY FACE
  =============================== */
  const verifyFace = async () => {
    if (!modelsLoaded) {
      setError("Face models are still loading...");
      return;
    }

    setError("");
    setLoading(true);

    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError("Camera not ready. Please wait.");
      setLoading(false);
      return;
    }

    const img = new Image();
    img.src = imageSrc;

    img.onload = async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(
            img,
            new faceapi.SsdMobilenetv1Options({
              minConfidence: 0.5,   // 🔥 IMPORTANT: lower = more stable
            })
          )
          .withFaceLandmarks()
          .withFaceDescriptors();

        /* ❌ NO FACE */
        if (detections.length === 0) {
          setError("No face detected. Please face the camera clearly.");
          setLoading(false);
          return;
        }

        /* ❌ MULTIPLE FACES */
        if (detections.length > 1) {
          setError("Multiple faces detected. Only one person is allowed.");
          setLoading(false);
          return;
        }

        /* ✅ EXACTLY ONE FACE */
        const currentDescriptor = Array.from(detections[0].descriptor);

        /* ===============================
           BACKEND VERIFY
        =============================== */
        await axios.post("/api/face/verify", {
          currentDescriptor,
        });

        setLoading(false);
        onSuccess(); // ✅ FACE VERIFIED

      } catch (err) {
        setError("Face does not match registration.");
        setLoading(false);
      }
    };
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Face Verification</h3>

        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="face-webcam"
          videoConstraints={{
            width: 300,
            height: 300,
            facingMode: "user",
          }}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={verifyFace} disabled={loading}>
          {loading ? "Verifying..." : "Capture & Verify"}
        </button>

        {/* ✅ Cancel button BLUE */}
        <button
          className="cancel"
          style={{ background: "#1e40af", color: "white" }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
