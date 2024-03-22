import axios from "axios";
import { constant } from "constant";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const addAuthorizationHeader = (headers) => {
  const token = getToken();
  if (token) {
    headers.Authorization = token;
  }
};

export const postApi = async (path, data, login) => {
  try {
    const headers = {};
    addAuthorizationHeader(headers);

    let result = await axios.post('/' + path, data, { headers });

    if (result.data?.token && result.data?.token !== null) {
      if (login) {
        localStorage.setItem("token", result.data?.token);
      } else {
        sessionStorage.setItem("token", result.data?.token);
      }
      localStorage.setItem("user", JSON.stringify(result.data?.user));
    }

    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const putApi = async (path, data, id) => {
  try {
    const headers = {};
    addAuthorizationHeader(headers);

    let result = await axios.put('/' + path, data, { headers });
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const deleteApi = async (path, id) => {
  try {
    const headers = {};
    addAuthorizationHeader(headers);

    let result = await axios.delete('/' + path + id, { headers });

    if (result.data?.token && result.data?.token !== null) {
      localStorage.setItem("token", result.data?.token);
    }

    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const deleteManyApi = async (path, data) => {
  try {
    const headers = {};
    addAuthorizationHeader(headers);

    let result = await axios.post('/' + path, data, { headers });

    if (result.data?.token && result.data?.token !== null) {
      localStorage.setItem("token", result.data?.token);
    }

    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const getApi = async (path, id) => {
  try {
    const headers = {};
    addAuthorizationHeader(headers);

    let result;

    if (id) {
      result = await axios.get('/' + path+id, { headers });
    } else {
      result = await axios.get('/' + path, { headers });
    }

    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};
