function info(data) {
  console.log(`INFO: ${new Date()}`, data);
}

function error(data) {
  console.log(`ERROR: ${new Date()}`, data);
}

module.exports = {
  info,
  error,
};
