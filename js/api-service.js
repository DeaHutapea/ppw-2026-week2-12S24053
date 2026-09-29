const DATA_ROOT = new URL("../data/", import.meta.url);

async function getJson(filename) {
  const response = await fetch(new URL(filename, DATA_ROOT));
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: gagal memuat ${filename}`);
  }
  return response.json();
}

export const ApiService = {
  getProfile: () => getJson("profile.json"),
  getProjects: () => getJson("projects.json"),
  getServices: () => getJson("services.json"),
  async submitServiceOrder(payload) {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: order tidak dapat dikirim`);
    }
    return response.json();
  }
};
