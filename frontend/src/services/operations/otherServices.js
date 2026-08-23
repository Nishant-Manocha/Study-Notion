import { toast } from "react-hot-toast"
import { categoriesApi, reviewApi } from "../apis";
import { apiConnector } from "../apiConnector";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const getWithRetry = async (url, attempts) => {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await apiConnector('GET', url);
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await wait(1500);
      }
    }
  }

  throw lastError;
};

// Get all reviews
export const getAllReviews = async ({ silent = false, attempts = 1 } = {}) => {
  let result = [];
  try {
    const response = await getWithRetry(reviewApi.GET_GET_ALL_REVIEWS_API, attempts);
    result = response.data?.data;
  } catch (error) {
    if (!silent) {
      toast.error('Could not fetch course reviews. Please try again.');
    }
  }
  return result
}

// Get all Categories
export const getAllCategories = async ({ silent = false, attempts = 1 } = {}) => {
  let result = [];
  try {
    const response = await getWithRetry(categoriesApi.GET_GET_ALL_CATEGORIES_API, attempts);
    result = response.data?.data;
  } catch (error) {
    if (!silent) {
      toast.error('Could not fetch course categories. Please try again.');
    }
  }
  return result
}
