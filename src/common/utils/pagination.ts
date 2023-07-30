/**
 *
 * @param page page number
 * @param perPage number of items per page
 * @returns query params used for pagination
 */
export function paramsToPage(page: number, perPage: number) {
  const skip = (page - 1) * perPage;
  const limit = perPage;
  return {
    limit,
    skip,
  };
}
