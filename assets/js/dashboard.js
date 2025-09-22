// import { auth } from "./firebase.js";
// document.addEventListener("DOMContentLoaded", () => {
//   const path = window.location.pathname;

//   if (path.includes("/html/student-dashboard.html")) {
//     loadStudentDashboard();
//   } else if (path.includes("/html/submit-issue.html")) {
//     handleIssueSubmission();
//   } else if (path.includes("/html/issues-history.html")) {
//     loadStudentIssuesHistory();
//   } else if (path.includes("/html/staff-dashboard.html")) {
//     loadStaffDashboard();
//   } else if (path.includes("/html/admin-dashboard.html")) {
//     loadAdminDashboard();
//   } else if (path.includes("/html/student-profile.html")) {
//     loadStudentProfile();
//   }
// });

// // --- STUDENT FUNCTIONS ---

// function loadStudentDashboard() {
//   const currentUser = auth.currentUser;
//   if (!currentUser) return;

//   const statsContainer = document.getElementById("stats-container");
//   const recentIssuesTable = document.getElementById("recent-issues-tbody");

//   // Listener for issue stats and recent issues
//   db.collection("issues")
//     .where("studentId", "==", currentUser.uid)
//     .orderBy("createdAt", "desc")
//     .onSnapshot((snapshot) => {
//       let total = 0,
//         inProgress = 0,
//         resolved = 0;
//       let count = 0;
//       recentIssuesTable.innerHTML =
//         '<tr><td colspan="4" class="text-center">Loading...</td></tr>';
//       let recentHtml = "";

//       if (snapshot.empty) {
//         recentIssuesTable.innerHTML =
//           '<tr><td colspan="4" class="text-center">No issues submitted yet.</td></tr>';
//       }

//       snapshot.forEach((doc) => {
//         const issue = doc.data();
//         total++;
//         if (issue.status === "In Progress") inProgress++;
//         if (issue.status === "Resolved") resolved++;

//         // Populate recent issues table (first 10)
//         if (count < 10) {
//           recentHtml += `
//                         <tr>
//                             <td>${issue.title}</td>
//                             <td>${issue.category}</td>
//                             <td>${new Date(
//                               issue.createdAt.seconds * 1000
//                             ).toLocaleDateString()}</td>
//                             <td><span class="status-badge status-${issue.status
//                               .toLowerCase()
//                               .replace(" ", "-")}">${issue.status}</span></td>
//                         </tr>
//                     `;
//           count++;
//         }
//       });

//       statsContainer.innerHTML = `
//                 <div class="col-md-4">
//                     <div class="card dashboard-card p-3 mb-3">
//                         <h3>${total}</h3>
//                         <p>Total Issues Submitted</p>
//                     </div>
//                 </div>
//                 <div class="col-md-4">
//                     <div class="card dashboard-card dashboard-card-accent p-3 mb-3">
//                         <h3>${inProgress}</h3>
//                         <p>Issues In Progress</p>
//                     </div>
//                 </div>
//                 <div class="col-md-4">
//                     <div class="card dashboard-card p-3 mb-3" style="border-left-color: var(--success)">
//                         <h3>${resolved}</h3>
//                         <p>Issues Resolved</p>
//                     </div>
//                 </div>
//             `;
//       if (recentHtml) recentIssuesTable.innerHTML = recentHtml;
//     });
// }

// function handleIssueSubmission() {
//   const form = document.getElementById("submit-issue-form");
//   if (!form) return;

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       showToast("You must be logged in to submit an issue.", "danger");
//       return;
//     }

//     const submitBtn = form.querySelector('button[type="submit"]');
//     submitBtn.disabled = true;
//     submitBtn.innerHTML =
//       '<span class="spinner-border spinner-border-sm"></span> Submitting...';

//     try {
//       await db.collection("issues").add({
//         studentId: currentUser.uid,
//         studentName: sessionStorage.getItem("userName") || "N/A",
//         title: form.title.value,
//         category: form.category.value,
//         description: form.description.value,
//         status: "New",
//         assignedStaffId: null,
//         assignedStaffName: null,
//         feedback: "",
//         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//         updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
//       });

//       showToast("Issue submitted successfully!", "success");
//       form.reset();
//       setTimeout(() => (window.location.href = "student-dashboard.php"), 1500);
//     } catch (error) {
//       console.error("Issue submission error:", error);
//       showToast("Failed to submit issue. " + error.message, "danger");
//     } finally {
//       submitBtn.disabled = false;
//       submitBtn.innerHTML = "Submit Issue";
//     }
//   });
// }

// function loadStudentIssuesHistory() {
//   const currentUser = auth.currentUser;
//   if (!currentUser) return;
//   const issuesTable = document.getElementById("issues-history-tbody");

//   db.collection("issues")
//     .where("studentId", "==", currentUser.uid)
//     .orderBy("createdAt", "desc")
//     .onSnapshot((snapshot) => {
//       let tableHtml = "";
//       if (snapshot.empty) {
//         issuesTable.innerHTML =
//           '<tr><td colspan="5" class="text-center">You have not submitted any issues.</td></tr>';
//         return;
//       }
//       snapshot.forEach((doc) => {
//         const issue = doc.data();
//         tableHtml += `
//                 <tr>
//                     <td>${issue.title}</td>
//                     <td>${issue.category}</td>
//                     <td>${new Date(
//                       issue.createdAt.seconds * 1000
//                     ).toLocaleString()}</td>
//                     <td>${issue.assignedStaffName || "Not Assigned"}</td>
//                     <td><span class="status-badge status-${issue.status
//                       .toLowerCase()
//                       .replace(" ", "-")}">${issue.status}</span></td>
//                 </tr>
//             `;
//       });
//       issuesTable.innerHTML = tableHtml;
//     });
// }

// function loadStudentProfile() {
//   const currentUser = auth.currentUser;
//   if (!currentUser) return;

//   const profileForm = document.getElementById("profile-form");
//   const passwordForm = document.getElementById("password-form");

//   db.collection("users")
//     .doc(currentUser.uid)
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         const user = doc.data();
//         profileForm.fullName.value = user.fullName;
//         profileForm.regNo.value = user.regNo;
//         profileForm.email.value = user.email;
//       }
//     });

//   profileForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const submitBtn = profileForm.querySelector("button");
//     submitBtn.disabled = true;

//     try {
//       await db.collection("users").doc(currentUser.uid).update({
//         fullName: profileForm.fullName.value,
//         regNo: profileForm.regNo.value,
//       });
//       showToast("Profile updated successfully!", "success");
//     } catch (error) {
//       showToast("Error updating profile: " + error.message, "danger");
//     } finally {
//       submitBtn.disabled = false;
//     }
//   });

//   passwordForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const newPassword = passwordForm.newPassword.value;
//     const confirmPassword = passwordForm.confirmPassword.value;
//     if (newPassword !== confirmPassword) {
//       showToast("Passwords do not match.", "danger");
//       return;
//     }
//     const submitBtn = passwordForm.querySelector("button");
//     submitBtn.disabled = true;

//     try {
//       await currentUser.updatePassword(newPassword);
//       showToast("Password updated successfully!", "success");
//       passwordForm.reset();
//     } catch (error) {
//       showToast("Error updating password: " + error.message, "danger");
//     } finally {
//       submitBtn.disabled = false;
//     }
//   });
// }

// // --- STAFF FUNCTIONS ---

// function loadStaffDashboard() {
//   const currentUser = auth.currentUser;
//   if (!currentUser) return;
//   const issuesTable = document.getElementById("staff-issues-tbody");
//   const updateModal = new bootstrap.Modal(
//     document.getElementById("updateIssueModal")
//   );

//   db.collection("issues")
//     .where("assignedStaffId", "==", currentUser.uid)
//     .orderBy("updatedAt", "desc")
//     .onSnapshot((snapshot) => {
//       let tableHtml = "";
//       if (snapshot.empty) {
//         issuesTable.innerHTML =
//           '<tr><td colspan="5" class="text-center">No issues assigned to you.</td></tr>';
//         return;
//       }
//       snapshot.forEach((doc) => {
//         const issue = doc.data();
//         issue.id = doc.id;
//         tableHtml += `
//                 <tr>
//                     <td>${issue.studentName}</td>
//                     <td>${issue.title}</td>
//                     <td>${new Date(
//                       issue.updatedAt.seconds * 1000
//                     ).toLocaleString()}</td>
//                     <td><span class="status-badge status-${issue.status
//                       .toLowerCase()
//                       .replace(" ", "-")}">${issue.status}</span></td>
//                     <td><button class="btn btn-sm btn-accent" onclick='openUpdateModal(${JSON.stringify(
//                       issue
//                     )})'>Update</button></td>
//                 </tr>
//             `;
//       });
//       issuesTable.innerHTML = tableHtml;
//     });

//   // Handle modal form submission
//   const updateForm = document.getElementById("update-issue-form");
//   updateForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const issueId = updateForm.issueId.value;
//     const newStatus = updateForm.status.value;
//     const newFeedback = updateForm.feedback.value;

//     try {
//       await db.collection("issues").doc(issueId).update({
//         status: newStatus,
//         feedback: newFeedback,
//         updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
//       });
//       showToast("Issue updated successfully!", "success");
//       updateModal.hide();
//     } catch (error) {
//       showToast("Error updating issue: " + error.message, "danger");
//     }
//   });
// }

// function openUpdateModal(issue) {
//   const modal = document.getElementById("updateIssueModal");
//   modal.querySelector("#modal-issue-title").textContent = issue.title;
//   modal.querySelector("#modal-issue-description").textContent =
//     issue.description;
//   modal.querySelector(
//     "#modal-issue-student"
//   ).textContent = `Submitted by: ${issue.studentName}`;

//   const form = modal.querySelector("#update-issue-form");
//   form.issueId.value = issue.id;
//   form.status.value = issue.status;
//   form.feedback.value = issue.feedback || "";

//   new bootstrap.Modal(modal).show();
// }

// // --- ADMIN FUNCTIONS ---

// let allIssues = [];
// let staffList = [];
// let issuesChart = null;
// let workloadChart = null;

// async function loadAdminDashboard() {
//   await fetchStaff();
//   setupAdminListeners();
// }

// async function fetchStaff() {
//   const snapshot = await db
//     .collection("users")
//     .where("role", "==", "staff")
//     .get();
//   staffList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// }

// function setupAdminListeners() {
//   const issuesTable = document.getElementById("admin-issues-tbody");

//   db.collection("issues")
//     .orderBy("createdAt", "desc")
//     .onSnapshot((snapshot) => {
//       allIssues = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       renderAdminIssuesTable(allIssues);
//       updateAnalytics(allIssues);
//     });
// }

// function renderAdminIssuesTable(issues) {
//   const issuesTable = document.getElementById("admin-issues-tbody");
//   let tableHtml = "";
//   if (issues.length === 0) {
//     issuesTable.innerHTML =
//       '<tr><td colspan="6" class="text-center">No issues found.</td></tr>';
//     return;
//   }

//   issues.forEach((issue) => {
//     const staffOptions = staffList
//       .map(
//         (staff) =>
//           `<option value="${staff.id}" ${
//             issue.assignedStaffId === staff.id ? "selected" : ""
//           }>${staff.fullName}</option>`
//       )
//       .join("");

//     tableHtml += `
//             <tr>
//                 <td>${issue.title}</td>
//                 <td>${issue.studentName}</td>
//                 <td><span class="status-badge status-${issue.status
//                   .toLowerCase()
//                   .replace(" ", "-")}">${issue.status}</span></td>
//                 <td>${new Date(
//                   issue.createdAt.seconds * 1000
//                 ).toLocaleDateString()}</td>
//                 <td>
//                     <select class="form-select form-select-sm" onchange="assignStaff('${
//                       issue.id
//                     }', this.value)">
//                         <option value="">Unassigned</option>
//                         ${staffOptions}
//                     </select>
//                 </td>
//                 <td><button class="btn btn-sm btn-danger" onclick="deleteIssue('${
//                   issue.id
//                 }')">Delete</button></td>
//             </tr>
//         `;
//   });
//   issuesTable.innerHTML = tableHtml;
// }

// async function assignStaff(issueId, staffId) {
//   const staffMember = staffList.find((s) => s.id === staffId);
//   const staffName = staffMember ? staffMember.fullName : null;

//   try {
//     await db
//       .collection("issues")
//       .doc(issueId)
//       .update({
//         assignedStaffId: staffId || null,
//         assignedStaffName: staffName,
//       });
//     showToast("Staff assigned successfully!", "success");
//   } catch (error) {
//     showToast("Error assigning staff: " + error.message, "danger");
//   }
// }

// async function deleteIssue(issueId) {
//   if (confirm("Are you sure you want to delete this issue permanently?")) {
//     try {
//       await db.collection("issues").doc(issueId).delete();
//       showToast("Issue deleted successfully!", "success");
//     } catch (error) {
//       showToast("Error deleting issue: " + error.message, "danger");
//     }
//   }
// }

// function updateAnalytics(issues) {
//   // Issues by Status Chart
//   const statusCounts = issues.reduce((acc, issue) => {
//     acc[issue.status] = (acc[issue.status] || 0) + 1;
//     return acc;
//   }, {});

//   const issueStatusCtx = document
//     .getElementById("issueStatusChart")
//     .getContext("2d");
//   if (issuesChart) issuesChart.destroy();
//   issuesChart = new Chart(issueStatusCtx, {
//     type: "doughnut",
//     data: {
//       labels: Object.keys(statusCounts),
//       datasets: [
//         {
//           data: Object.values(statusCounts),
//           backgroundColor: ["#0d6efd", "#f59e0b", "#10b981", "#6b7280"],
//         },
//       ],
//     },
//     options: { responsive: true, maintainAspectRatio: false },
//   });

//   // Staff Workload Chart
//   const workloadCounts = issues.reduce((acc, issue) => {
//     if (issue.assignedStaffName) {
//       acc[issue.assignedStaffName] = (acc[issue.assignedStaffName] || 0) + 1;
//     }
//     return acc;
//   }, {});

//   const staffWorkloadCtx = document
//     .getElementById("staffWorkloadChart")
//     .getContext("2d");
//   if (workloadChart) workloadChart.destroy();
//   workloadChart = new Chart(staffWorkloadCtx, {
//     type: "bar",
//     data: {
//       labels: Object.keys(workloadCounts),
//       datasets: [
//         {
//           label: "Assigned Issues",
//           data: Object.values(workloadCounts),
//           backgroundColor: "rgba(122, 12, 12, 0.7)",
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
//     },
//   });
// }
