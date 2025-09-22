// ===============================
// Initialize Supabase
// ===============================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js";

const SUPABASE_URL = "https://flcrrpggontcixtvjchx.supabase.co"; // Supabase URL
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsY3JycGdnb250Y2l4dHZqY2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTkwMDUsImV4cCI6MjA3MTg5NTAwNX0.yee0ZMsSmKCLaKHmEM_7azr-oH0kETyzHmuZOUYXOFo"; // your anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// Auth helpers
// ===============================
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth(allowedRoles = []) {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/html/login.html";
    return null;
  }

  // fetch user profile
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    window.location.href = "/html/login.html";
    return null;
  }

  if (allowedRoles.length && !allowedRoles.includes(profile.role)) {
    alert("Access denied!");
    window.location.href = "/html/login.html";
    return null;
  }

  return { user, profile };
}

// ===============================
// Signup
// ===============================
export async function signup(fullName, regNo, email, password, role) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  await supabase.from("users").insert([
    {
      id: data.user.id,
      full_name: fullName,
      reg_no: regNo,
      role,
      created_at: new Date(),
    },
  ]);

  alert("Signup successful!");
  window.location.href = "/html/student-dashboard.html";
}

// ===============================
// Login
// ===============================
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  // fetch profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profile.role === "admin")
    window.location.href = "/html/admin-dashboard.html";
  else if (profile.role === "staff")
    window.location.href = "/html/staff-dashboard.html";
  else window.location.href = "/html/student-dashboard.html";
}

// ===============================
// Logout
// ===============================
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "/html/login.html";
}

// ===============================
// Password Reset
// ===============================
export async function resetPassword(email) {
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/html/login.html",
  });
  alert("Password reset email sent!");
}

// ===============================
// Issue Submission
// ===============================
export async function submitIssue(title, category, description) {
  const { user, profile } = await requireAuth(["student"]);
  if (!user) return;

  const { error } = await supabase.from("issues").insert([
    {
      student_id: user.id,
      student_name: profile.full_name,
      title,
      category,
      description,
      status: "New",
      assigned_staff_id: null,
      assigned_staff_name: null,
      feedback: "",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  if (error) throw error;
  alert("Issue submitted!");
  window.location.href = "/html/student-dashboard.html";
}

// ===============================
// Load Student Dashboard
// ===============================
export async function loadStudentDashboard() {
  const { user, profile } = await requireAuth(["student"]);
  if (!user) return;

  const { data: issues } = await supabase
    .from("issues")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  const statsContainer = document.getElementById("stats-container");
  const recentIssuesTable = document.getElementById("recent-issues-tbody");

  const total = issues.length;
  const inProgress = issues.filter((i) => i.status === "In Progress").length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;

  statsContainer.innerHTML = `
        <div class="col-md-4">
            <div class="card dashboard-card p-3 mb-3">
                <h3>${total}</h3>
                <p>Total Issues Submitted</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card dashboard-card dashboard-card-accent p-3 mb-3">
                <h3>${inProgress}</h3>
                <p>Issues In Progress</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card dashboard-card p-3 mb-3" style="border-left-color: var(--success)">
                <h3>${resolved}</h3>
                <p>Issues Resolved</p>
            </div>
        </div>
    `;

  let recentHtml = "";
  issues.slice(0, 10).forEach((issue) => {
    recentHtml += `
            <tr>
                <td>${issue.title}</td>
                <td>${issue.category}</td>
                <td>${new Date(issue.created_at).toLocaleDateString()}</td>
                <td><span class="status-badge status-${issue.status
                  .toLowerCase()
                  .replace(" ", "-")}">${issue.status}</span></td>
            </tr>
        `;
  });

  recentIssuesTable.innerHTML =
    recentHtml ||
    '<tr><td colspan="4" class="text-center">No issues submitted yet.</td></tr>';
}

// ===============================
// Load Staff Dashboard
// ===============================
export async function loadStaffDashboard() {
  const { user, profile } = await requireAuth(["staff"]);
  if (!user) return;

  const { data: issues } = await supabase
    .from("issues")
    .select("*")
    .eq("assigned_staff_id", user.id)
    .order("updated_at", { ascending: false });

  const issuesTable = document.getElementById("staff-issues-tbody");
  let tableHtml = "";
  issues.forEach((issue) => {
    tableHtml += `
            <tr>
                <td>${issue.student_name}</td>
                <td>${issue.title}</td>
                <td>${new Date(issue.updated_at).toLocaleString()}</td>
                <td><span class="status-badge status-${issue.status
                  .toLowerCase()
                  .replace(" ", "-")}">${issue.status}</span></td>
                <td><button class="btn btn-sm btn-accent" onclick='openUpdateModal(${JSON.stringify(
                  issue
                )})'>Update</button></td>
            </tr>
        `;
  });
  issuesTable.innerHTML = tableHtml;
}

// ===============================
// Load Admin Dashboard
// ===============================
export async function loadAdminDashboard() {
  const { user, profile } = await requireAuth(["admin"]);
  if (!user) return;

  const { data: issues } = await supabase
    .from("issues")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: staffList } = await supabase
    .from("users")
    .select("*")
    .eq("role", "staff");

  const issuesTable = document.getElementById("admin-issues-tbody");
  let tableHtml = "";
  issues.forEach((issue) => {
    const staffOptions = staffList
      .map(
        (staff) => `
            <option value="${staff.id}" ${
          issue.assigned_staff_id === staff.id ? "selected" : ""
        }>${staff.full_name}</option>
        `
      )
      .join("");

    tableHtml += `
            <tr>
                <td>${issue.title}</td>
                <td>${issue.student_name}</td>
                <td><span class="status-badge status-${issue.status
                  .toLowerCase()
                  .replace(" ", "-")}">${issue.status}</span></td>
                <td>${new Date(issue.created_at).toLocaleDateString()}</td>
                <td>
                    <select class="form-select form-select-sm" onchange="assignStaff('${
                      issue.id
                    }', this.value)">
                        <option value="">Unassigned</option>
                        ${staffOptions}
                    </select>
                </td>
                <td><button class="btn btn-sm btn-danger" onclick="deleteIssue('${
                  issue.id
                }')">Delete</button></td>
            </tr>
        `;
  });
  issuesTable.innerHTML = tableHtml;
}

// ===============================
// Admin actions: assign/delete
// ===============================
export async function assignStaff(issueId, staffId) {
  const { data: staff } = await supabase
    .from("users")
    .select("*")
    .eq("id", staffId)
    .single();
  const staffName = staff?.full_name || null;

  await supabase
    .from("issues")
    .update({
      assigned_staff_id: staffId || null,
      assigned_staff_name: staffName,
    })
    .eq("id", issueId);

  alert("Staff assigned!");
}

export async function deleteIssue(issueId) {
  if (!confirm("Are you sure you want to delete this issue permanently?"))
    return;
  await supabase.from("issues").delete().eq("id", issueId);
  alert("Issue deleted!");
}
