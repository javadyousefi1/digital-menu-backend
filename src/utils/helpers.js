// pagination
async function paginate(model, query, pageSize = 10, pageIndex = 1, populate) {
    // Convert pageSize and pageIndex to numbers
    pageSize = parseInt(pageSize, 10);
    pageIndex = parseInt(pageIndex, 10);

    // Ensure pageIndex is at least 1
    if (pageIndex < 1) {
        pageIndex = 1;
    }

    // Calculate total number of documents
    const totalCount = await model.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Calculate how many documents to skip
    const skipDocuments = (pageIndex - 1) * pageSize;

    // Find documents for the current page
    const data = await model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skipDocuments)
        .limit(pageSize).populate(populate);


    // Determine if there are previous or next pages
    const hasPrevPage = pageIndex > 1;
    const hasNextPage = pageIndex < totalPages;

    return {
        totalCount,
        pageSize,
        pageIndex,
        totalPages,
        hasPrevPage,
        hasNextPage,
        data,
    };
}

module.exports = { paginate };
