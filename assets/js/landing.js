// import {
//   getAuth,
//   onAuthStateChanged,
// } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// import {
//   getFirestore,
//   doc,
//   getDoc,
// } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// import { app } from "./firebase.js";

// const auth = getAuth(app);
// const db = getFirestore(app);

// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     try {
//       // ✅ Correct: pass db, "users", user.uid
//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         console.log("User data:", userData);

//         // Example redirect by role
//         if (userData.role === "admin") {
//           window.location.href = "/html/admin-dashboard.html";
//         } else if (userData.role === "staff") {
//           window.location.href = "/html/staff-dashboard.html";
//         } else {
//           window.location.href = "/html/student-dashboard.html";
//         }
//       } else {
//         console.warn("No such user document!");
//       }
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//     }
//   } else {
//     console.log("No user logged in");
//     window.location.href = "/html/login.html";
//   }
// });
