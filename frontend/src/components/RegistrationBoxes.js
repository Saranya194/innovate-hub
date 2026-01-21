import React from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  { key: "admin", title: "Admin", img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
  { key: "faculty", title: "Faculty", img: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png" },
  { key: "student", title: "Student", img: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png" }
];

export default function RegistrationBoxes() {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="registration-title">New Registration</h2>

      <div className="boxes-container">
        {roles.map((r) => (
          <div
            key={r.key}
            className="box"
            onClick={() => {
              if (r.key === "admin") navigate("/admin-login");
              if (r.key === "student") navigate("/student-register");
              if (r.key === "faculty") navigate("/faculty-register");
            }}
          >
            <img src={r.img} alt={r.title} />
            <h3>{r.title}</h3>
            <p>Click to go to {r.title} registration</p>
          </div>
        ))}
      </div>
    </section>
  );
}
