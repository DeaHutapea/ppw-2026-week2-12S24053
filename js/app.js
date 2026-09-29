import { ApiService } from "./api-service.js";

const state = { projects: [], orders: loadOrders() };
const $ = (selector) => document.querySelector(selector);

function loadOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem("serviceOrders") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("[Storage Error]", error);
    return [];
  }
}

function escapeText(value) {
  const element = document.createElement("span");
  element.textContent = String(value ?? "");
  return element.textContent;
}

function safeImageUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function setState({ loading = false, error = false, empty = false, success = false } = {}) {
  $("#projectsLoading").classList.toggle("d-none", !loading);
  $("#projectsError").classList.toggle("d-none", !error);
  $("#projectsEmpty").classList.toggle("d-none", !empty);
  $("#projectsGrid").classList.toggle("d-none", !success);
}

function renderProfile(profile) {
  $("#profileName").textContent = profile.name;
  $("#profileRole").textContent = profile.role;
  $("#profileStatus").textContent = profile.status;
  const image = $("#profileImage");
  image.src = safeImageUrl(profile.image) || image.src;
  image.alt = `Foto profil ${escapeText(profile.name)}`;
  const stats = $("#profileStats");
  stats.replaceChildren(...profile.stats.map((stat) => {
    const wrapper = document.createElement("div");
    wrapper.className = "stat-item";
    const value = document.createElement("span");
    value.className = "stat-val";
    value.textContent = stat.value;
    const label = document.createElement("span");
    label.className = "stat-lbl";
    label.textContent = stat.label;
    wrapper.append(value, label);
    return wrapper;
  }));
}

function createProjectCard(project) {
  const col = document.createElement("div");
  col.className = "col";
  const card = document.createElement("article");
  card.className = "card project-card h-100 shadow-sm";
  const image = document.createElement("img");
  image.className = "card-banner project-image";
  image.src = safeImageUrl(project.image);
  image.alt = "";
  image.loading = "lazy";
  const body = document.createElement("div");
  body.className = "card-body";
  const badge = document.createElement("span");
  badge.className = "badge text-bg-primary mb-2";
  badge.textContent = project.category;
  const title = document.createElement("h3");
  title.className = "h6 card-title";
  title.textContent = project.title;
  const description = document.createElement("p");
  description.className = "card-text text-secondary small";
  description.textContent = project.description;
  const button = document.createElement("button");
  button.className = "btn btn-outline-primary btn-sm mt-2";
  button.type = "button";
  button.dataset.projectId = project.id;
  button.textContent = "Lihat Detail";
  body.append(badge, title, description, button);
  card.append(image, body);
  col.append(card);
  return col;
}

function renderProjects(projects) {
  const category = $("#categoryFilter").value;
  const filtered = category === "all" ? projects : projects.filter((project) => project.category === category);
  $("#projectsGrid").replaceChildren(...filtered.map(createProjectCard));
  setState({ empty: filtered.length === 0, success: filtered.length > 0 });
}

function openProjectModal(projectId) {
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) return;
  $("#projectModalTitle").textContent = project.title;
  const body = $("#projectModalBody");
  body.replaceChildren();
  const image = document.createElement("img");
  image.src = safeImageUrl(project.image);
  image.alt = project.title;
  image.className = "img-fluid rounded mb-3 w-100";
  const description = document.createElement("p");
  description.className = "text-secondary";
  description.textContent = project.description;
  const tags = document.createElement("p");
  tags.className = "small text-secondary";
  tags.textContent = `Tags: ${project.tags.join(", ")}`;
  const list = document.createElement("ul");
  project.details.forEach((detail) => {
    const item = document.createElement("li");
    item.textContent = detail;
    list.append(item);
  });
  const link = document.createElement("a");
  link.href = safeImageUrl(project.link) || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "btn btn-primary";
  link.textContent = "Buka repository";
  body.append(image, description, tags, list, link);
  bootstrap.Modal.getOrCreateInstance($("#universalProjectModal")).show();
}

function renderServices(services) {
  $("#servicesList").replaceChildren(...services.map((service) => {
    const item = document.createElement("article");
    item.className = "service-item border-bottom py-3";
    const title = document.createElement("h3");
    title.className = "h6 mb-1";
    title.textContent = service.name;
    const description = document.createElement("p");
    description.className = "small text-secondary mb-1";
    description.textContent = service.description;
    const price = document.createElement("strong");
    price.className = "small text-primary";
    price.textContent = service.price;
    item.append(title, description, price);
    return item;
  }));
}

function updateOrderCount() {
  $("#orderCount").textContent = state.orders.length;
}

function showToast(title, message) {
  $("#toastTitle").textContent = title;
  $("#toastMessage").textContent = message;
  bootstrap.Toast.getOrCreateInstance($("#feedbackToast")).show();
}

async function initialize() {
  try {
    const [profile, projects, services] = await Promise.all([
      ApiService.getProfile(), ApiService.getProjects(), ApiService.getServices()
    ]);
    state.projects = projects;
    renderProfile(profile);
    renderServices(services);
    const categories = [...new Set(projects.map((project) => project.category))];
    $("#categoryFilter").append(...categories.map((category) => new Option(category, category)));
    renderProjects(projects);
  } catch (error) {
    console.error("[API Network Error]", error);
    $("#projectsError").textContent = "Data belum dapat dimuat. Periksa koneksi atau jalankan melalui Live Server.";
    setState({ error: true });
  }
}

$("#categoryFilter").addEventListener("change", () => renderProjects(state.projects));
$("#projectsGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-id]");
  if (button) openProjectModal(button.dataset.projectId);
});
$("#serviceForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const button = $("#submitOrder");
  const originalText = button.textContent;
  button.disabled = true;
  const spinner = document.createElement("span");
  spinner.className = "spinner-border spinner-border-sm me-1";
  spinner.setAttribute("aria-hidden", "true");
  button.replaceChildren(spinner, document.createTextNode("Mengirim..."));
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    await ApiService.submitServiceOrder(payload);
    state.orders.push({ ...payload, createdAt: new Date().toISOString() });
    localStorage.setItem("serviceOrders", JSON.stringify(state.orders));
    updateOrderCount();
    form.reset();
    form.classList.remove("was-validated");
    showToast("Sukses!", "Permintaan layanan berhasil dikirim.");
  } catch (error) {
    console.error("[Order Error]", error);
    showToast("Gagal", "Permintaan belum terkirim. Silakan coba lagi.");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});

updateOrderCount();
initialize();
