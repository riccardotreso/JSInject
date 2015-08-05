var express = require('express'),
    common = require('../controllers/common'),
    token = require('../controllers/token');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/save', function(req, res) {
    common.setResponseHeaders(res);
    
    var message = req.body;    
   
    token.save(message, function(doc){
        if(doc){
            res.status(200).json({status:"ok"});
        }
        else{
            res.status(500).json({status:"ko"});
        }
            
    });
});

router.get('/get/:token', function(req, res) {
    
    common.setResponseHeaders(res);
    
    if(req.params.token){
        token.get(req.params.token, function(doc){
            if(doc){
                res.status(200).json(doc);
            }
            else{
                res.status(500).json({status:"ko"});
            }
        });
    }
    
  
});


module.exports = router;
