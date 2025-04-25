const express = require('express');
const { validateToken } = require('../auth/authMiddleware');

const router = express.Router();

router.get('/', validateToken, (req, res) => {
  res.status(200).json({
    message: `Hello, authorized user!`,
    user: req.user 
  });
});

module.exports = router;
