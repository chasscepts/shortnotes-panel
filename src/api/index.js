import axios from 'axios';

const host = 'http://127.0.0.1:3000';

const apiPath = '/api/v1/';

const normalizePath = (path) => {
  let p = path;
  if (p.endsWith('/')) p = p.substring(0, p.length - 1);
  if (p.startsWith('/')) p = p.substring(1);
  return p;
};

const url = (path, api = true) => {
  const fullpath = api ? `${apiPath}${normalizePath(path)}` : path;
  return (new URL(fullpath, host)).href;
};

const header = (token) => ({ Authorization: token });

const normalizeError = (err) => {
  if (!err) {
    return { message: 'An unknown error encountered. Please try again.' };
  }
  if (err.response) {
    return { message: err.response.data.message || JSON.stringify(err.response.data) };
  }
  if (err.request) {
    return { message: 'Server is not responding. One possibility is that CORS is disabled on server. Check your console to see' };
  }
  if (err.message) {
    return { message: err.message };
  }
  if (typeof err === 'string') {
    return { message: err };
  }
  return { message: 'An unknown error encountered. Please try again.' };
};

const instantiate = (headers = null) => {
  const config = { responseType: 'json' };
  if (headers) config.headers = headers;
  return axios.create(config);
};

/**
 * @param {axios} instance An instance of axios to use for this request
 * @param {string} path relative url
 * @returns Promise that resolves to fetched data when request is successful
 * and rejects with error when request fails
 */
const get = (path, headers = null) => new Promise((resolve, reject) => {
  instantiate(headers).get(path)
    .then(({ data }) => resolve(data))
    .catch((err) => reject(normalizeError(err)));
});

/**
 * @param {axios} instance An instance of axios to use for this request
 * @param {string} path relative url
 * @param {{ string: any }} data sent in body of this post
 * @returns Promise that resolves to fetched data when request is successful
 * and rejects with error when request fails
 */
const post = (path, data, headers = null) => new Promise((resolve, reject) => {
  instantiate(headers).post(path, data)
    .then(({ data }) => resolve(data))
    .catch((err) => reject(normalizeError(err)));
});

/**
 * @param {axios} instance An instance of axios to use for this request
 * @param {string} path relative url
 * @param {{ string: any }} data sent in body of this put
 * @returns Promise that resolves when request is successful
 * and rejects with error when request fails
 */
const put = (path, data, headers = null) => new Promise((resolve, reject) => {
  instantiate(headers).put(path, data)
    .then(({ data }) => resolve(data))
    .catch((err) => reject(normalizeError(err)));
});

/**
 * @param {axios} instance An instance of axios to use for this request
 * @param {string} path relative url
 * @returns Promise that resolves if resource is successfully deleted
 * and rejects with error when request fails
 */
const destroy = (path, headers = null) => new Promise((resolve, reject) => {
  instantiate(headers).delete(path)
    .then(({ data }) => resolve(data))
    .catch((err) => reject(normalizeError(err)));
});

export const getCategories = () => get(url('/categories'));

export const getNotes = () => get(url('/notes'));

export const getCategory = (id) => get(url(`/categories/${id}`));

export const getNote = (id) => get(url(`/notes/${id}`));

export const createCategory = (token, category) => post(url('/categories'), category, header(token));

export const createNote = (token, note) => post(url('/notes'), note, header(token));

export const updateCategory = (token, category) => put(url('/categories'), category, header(token));

export const updateNote = (token, id, note) => put(url(`/notes/${id}`), note, header(token));

export const deleteCategory = (token, id) => destroy(url(`/categories/${id}`), header(token));

export const deleteNote = (token, id) => destroy(url(`/notes/${id}`), header(token));

export const login = (user) => post(url('/auth', false), user);
