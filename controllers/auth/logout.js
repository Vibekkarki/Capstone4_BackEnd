module.exports = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: "Logout failed" });
    }
    res.status(200).json({ msg: "Logout successful" });
  });
};
