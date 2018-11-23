var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:topic', function(req, res, next) {
  res.render('index', { topic:req.params.topic, title: 'Express' });
});

module.exports = router;
