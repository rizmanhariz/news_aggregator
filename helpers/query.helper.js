function getMongoPagination({ page, limit }) {
  const finalPage = parseInt(page, 10) || 1;
  const skip = (finalPage - 1) * (parseInt(limit, 10) || 10);
  return { skip, page: finalPage};
}

module.exports = {
  getMongoPagination,
};
