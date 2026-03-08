const API_URL = "http://localhost:5239/Impressoras";

export async function getImpressoras() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
}

export async function criarImpressora(impressora) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(impressora),
  });

  return response.json();
}

export async function deletarImpressora(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
