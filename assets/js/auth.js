// import { auth, db } from "./firebase.js";

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
//   signOut,
//   onAuthStateChanged,
// } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// import {
//   doc,
//   setDoc,
//   getDoc,
//   serverTimestamp,
// } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// // Utility function for redirection based on role
// function redirectToDashboard(role) {
//   switch (role) {
//     case "student":
//       window.location.replace("/html/student-dashboard.html");
//       break;
//     case "staff":
//       window.location.replace("/html/staff-dashboard.html");
//       break;
//     case "admin":
//       window.location.replace("/html/admin-dashboard.html");
//       break;
//     default:
//       // Fallback for an unknown role, redirect to a generic page or login
//       window.location.replace("/html/login.html");
//       break;
//   }
// }

// // ===============================
// // Signup
// // ===============================
// const signupForm = document.getElementById("signup-form");
// if (signupForm) {
//   signupForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const fullName = document.getElementById("fullName").value;
//     const regNo = document.getElementById("regNo").value;
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     const role = document.getElementById("role").value;

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       await setDoc(doc(db, "users", user.uid), {
//         fullName,
//         regNo,
//         email,
//         role,
//         createdAt: serverTimestamp(),
//       });

//       alert("Signup successful!");
//       redirectToDashboard(role); // Use the new function to redirect
//     } catch (error) {
//       console.error("Signup Error:", error);
//       alert(error.message);
//     }
//   });
// }

// // ===============================
// // Login
// // ===============================
// const loginForm = document.getElementById("login-form");
// if (loginForm) {
//   loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         redirectToDashboard(userData.role); // Use the new function to redirect
//       } else {
//         // User document does not exist, log them out and redirect to login
//         await signOut(auth);
//         alert("User profile not found. Please contact support.");
//         window.location.replace("/html/login.html");
//       }
//       console.log("Logged in user", user);
//     } catch (error) {
//       console.error("Login Error:", error);
//       alert(error.message);
//     }
//   });
// }

// // ===============================
// // Forgot Password
// // ===============================
// const forgotForm = document.getElementById("forgot-form");
// if (forgotForm) {
//   forgotForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const email = document.getElementById("forgot-email").value;

//     try {
//       await sendPasswordResetEmail(auth, email);
//       alert("Password reset email sent!");
//     } catch (error) {
//       console.error("Forgot Password Error:", error);
//       alert(error.message);
//     }
//   });
// }

// // ===============================
// // Logout
// // ===============================
// const logoutBtn = document.getElementById("logout-btn");
// if (logoutBtn) {
//   logoutBtn.addEventListener("click", async () => {
//     try {
//       await signOut(auth);
//       // Fixed the logout URL from /logon.html to /login.html
//       window.location.replace("/html/login.html");
//     } catch (error) {
//       console.error("Logout Error:", error);
//       alert(error.message);
//     }
//   });
// }

// // ===============================
// // Auth State Listener (Route Protection)
// // ===============================
// onAuthStateChanged(auth, async (user) => {
//   const protectedPages = {
//     "/html/student-dashboard.html": "student",
//     "/html/staff-dashboard.html": "staff",
//     "/html/admin-dashboard.html": "admin",
//   };
//   const currentPage = window.location.pathname.split("/").pop();

//   if (protectedPages[currentPage]) {
//     if (!user) {
//       // Not logged in -> redirect to login
//       window.location.replace("/html/login.html");
//     } else {
//       // Logged in -> check role
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const requiredRole = protectedPages[currentPage];

//         // If the user's role does not match the page's required role
//         if (userData.role !== requiredRole) {
//           alert("Access denied!");
//           // Redirect to the appropriate dashboard for their role
//           redirectToDashboard(userData.role);
//         }
//       } else {
//         // No user profile in Firestore
//         await signOut(auth);
//         alert("User profile not found. Logging you out.");
//         window.location.replace("/html/login.html");
//       }
//     }
//   }
// });
