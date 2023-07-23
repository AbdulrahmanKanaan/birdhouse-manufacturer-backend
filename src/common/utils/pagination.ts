export function paramsToPage(page: number, perPage: number) {
  const skip = (page - 1) * perPage;
  const limit = perPage;
  return {
    limit,
    skip,
  };
}
