
async function index(req, res) {
  return res.send(JSON.stringify({
    api: 'Hópverkefni 1',
  }));
}

module.exports = {
  index,
};
