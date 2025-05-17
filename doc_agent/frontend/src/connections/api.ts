import axios from "axios";

// Base url for axios
const backendConnection =
  // create axios baseurl
  axios.create({
    baseURL: process.env.DOC_URL || "/api",
  });

export default backendConnection;
