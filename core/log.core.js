function info(identifier, data = "") {
  console.log(`INFO: ${new Date()}`, identifier, data);
}

function error(identifier, data = "") {
  console.log(`ERROR: ${new Date()}`, identifier, data);
}

module.exports = {
  info,
  error,
};
