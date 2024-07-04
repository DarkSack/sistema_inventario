export const useBaseURL = (url) => {
  const baseURL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCAL_URL
      : import.meta.env.VITE_PROD_URL;

  return `${baseURL}/${url}`;
};
