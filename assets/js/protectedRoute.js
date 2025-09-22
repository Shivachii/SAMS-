// // protectedRoute.js
// import { auth, db } from "./firebase.js";
// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// import {
//   doc,
//   getDoc,
// } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// // ===============================
// // Protect route function
// // ===============================
// export function protectRoute(allowedRoles = []) {
//   onAuthStateChanged(auth, async (user) => {
//     const path = window.location.pathname;

//     if (!user) {
//       // Not logged in → send to login
//       window.location.replace("/html/login.html");
//       return;
//     }

//     try {
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (!userDoc.exists()) {
//         window.location.replace("/html/login.html");
//         return;
//       }

//       const role = userDoc.data().role;

//       //  Check if role is allowed
//       if (!allowedRoles.includes(role)) {
//         alert("Access denied!");
//         window.location.replace("/html/login.html");
//       }
//     } catch (error) {
//       console.error("Error protecting route:", error);
//       window.location.replace("/html/login.html");
//     }
//   });
// }
