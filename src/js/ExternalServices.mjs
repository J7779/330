const baseURL = `http://server-nodejs.cit.byui.edu:3000`;

async function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  throw new Error("Bad Response");
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    return (await handleResponse(response)).Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    return (await handleResponse(response)).Result;
  }

  async searchByTerm(term) {
    const response = await fetch(`${baseURL}products/search?term=${term}`);
    return (await handleResponse(response)).Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`${baseURL}checkout/`, options);
    return handleResponse(response);
  }
}