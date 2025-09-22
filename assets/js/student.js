// import { db } from "./firebase.js";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   addDoc,
//   serverTimestamp,
// } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// document.addEventListener("DOMContentLoaded", () => {
//   const userUid = sessionStorage.getItem("userUid");
//   if (!userUid) return;

//   loadStudentDashboardData(userUid);
// });

// async function loadStudentDashboardData(uid) {
//   const issuesRef = collection(db, "issues");
//   const q = query(
//     issuesRef,
//     where("studentUid", "==", uid),
//     orderBy("createdAt", "desc")
//   );

//   const querySnapshot = await getDocs(q);
//   let openCount = 0,
//     reviewCount = 0,
//     closedCount = 0;
//   const recentIssues = [];

//   querySnapshot.forEach((doc) => {
//     const issue = doc.data();
//     switch (issue.status) {
//       case "Open":
//         openCount++;
//         break;
//       case "In-Review":
//         reviewCount++;
//         break;
//       case "Closed":
//         closedCount++;
//         break;
//     }
//     if (recentIssues.length < 10) {
//       recentIssues.push({ id: doc.id, ...issue });
//     }
//   });

//   // Update dashboard stats
//   document.getElementById("open-issues-count").textContent = openCount;
//   document.getElementById("in-review-issues-count").textContent = reviewCount;
//   document.getElementById("closed-issues-count").textContent = closedCount;

//   // Populate recent issues table
//   const tableBody = document.querySelector("#recent-issues-table tbody");
//   tableBody.innerHTML = ""; // Clear existing
//   recentIssues.forEach((issue) => {
//     const row = `<tr>
//             <td>${issue.id.substring(0, 8)}...</td>
//             <td>${issue.title}</td>
//             <td>${issue.category}</td>
//             <td><span class="status status-${issue.status
//               .toLowerCase()
//               .replace("-", "")}">${issue.status}</span></td>
//             <td>${issue.createdAt.toDate().toLocaleDateString()}</td>
//         </tr>`;
//     tableBody.innerHTML += row;
//   });
// }

// // Logic for submit-issue.php form
// const submitIssueForm = document.getElementById("submit-issue-form");
// if (submitIssueForm) {
//   submitIssueForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     // ... get form data (title, desc, etc.)
//     const userUid = sessionStorage.getItem("userUid");
//     const userName = sessionStorage.getItem("userName");

//     await addDoc(collection(db, "issues"), {
//       title: "Example Title", // get from form
//       // ... other fields
//       studentUid: userUid,
//       studentName: userName,
//       status: "Open",
//       createdAt: serverTimestamp(),
//       assignedTo: null,
//     });

//     alert("Issue submitted successfully!");
//     window.location.href = "dashboard.php";
//   });
// }
