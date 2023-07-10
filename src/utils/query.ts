const queryString = new Proxy(
  new URLSearchParams(globalThis.location?.search),
  {
    get: (searchParams, prop) => searchParams.get(prop as string),
  }
);

export const getAuthDataFromUrl = () => {
  const authToken = queryString["authToken"];

  return {
    authToken,
  };
};
