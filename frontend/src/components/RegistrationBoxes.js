import React from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    key: "admin",
    title: "Admin",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    route: "/admin-login/admin",
    type: "login",
  },
  {
    key: "central-coordinator",
    title: "Central Coordinator",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    route: "/admin-login/central_coordinator",
    type: "login",
  },
  {
    key: "incubation-coordinator",
    title: "Incubation Coordinator",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    route: "/admin-login/incubation_coordinator",
    type: "login",
  },
  {
    key: "faculty",
    title: "Faculty",
    img: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    route: "/faculty-register",
    type: "register",
  },
  {
    key: "student",
    title: "Student",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png",
    route: "/student-register",
    type: "register",
  },
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
            onClick={() => navigate(r.route)}
          >
            <img src={r.img} alt={r.title} />
            <h3>{r.title}</h3>
            <p>
              Click to go to {r.title} {r.type === "login" ? "login" : "registration"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
