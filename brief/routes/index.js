'use strict'
var User = require('../schemas/userSchema');
var Role = require('../schemas/roleSchema');
var crypto = require('crypto');
var jwt = require("jsonwebtoken");

function ensureAuthorized(req, res, next) {
    var bearToken;
    var bearHeader = req.headers["authorization"];
    if (typeof bearHeader !== 'undefined') {
        var bear = bearHeader.split(" ");
        bearToken = bear[1];
        req.token = bearToken;
	  	jwt.verify(bearToken, process.env.JWT_SECRET, function(err, decoded) {
	  		if(err){
	  			res.sendStatus(403);	
	  		}else{
	  			req.user = decoded;
  				next();
	  		}
	  	})        
    } else {
        res.sendStatus(403);
    }
}

function checkIsAdmin(req, res, next){
	User.isAdmin({_id: req.user._id}, function(err, user) {
		if(user){
			next();
		}else{
			res.sendStatus(403);
		}
	})
}

function createToken(user){
	return jwt.sign({loginName:user.loginName, _id:user._id, role:user.role}
	                ,process.env.JWT_SECRET
	                ,{expiresIn: '1h'});// expressed in seconds or a string describing a time span rauchg/ms. Eg: 60, "2 days", "10h", "7d"
}

module.exports = function(app){ 
	app.get('/', function(req, res, next) {
	    res.render('index', { title: 'Express' });
	})

	app.get('/forbidden', function(req, res, next) {
	    res.render('forbidden', { title: 'Express' });
	})

	app.post('/authenticate', function(req, res) {

	});

	app.post('/signup', function(req, res) {
	    var md5 = crypto.createHash('md5');
	    var password = md5.update(req.body.password).digest('base64');		
	    User.findUser({loginName: req.body.loginName, password: password}, function(err, user) {
	        if (err) {
	            res.json({
	                status: 0,
	                data: 'Error occured: ' + err
	            });
	        } else {
	            if (user) {
	                var token = createToken(user);
	                res.json({
	                    status: 1,
	                    data: user,
	                    token: token
	                }); 
	            } else {
	                res.json({
	                    status: 0,
	                    data: 'Incorrect username/password'
	                });    
	            }
	        }
	    });
	});
	app.post('/signin', function(req, res) {		
	    User.findOne({loginName: req.body.loginName}, function(err, user) {
	        if (err) {
	            res.json({
	                status: 0,
	                data: 'Error occured: ' + err
	            });
	        } else {
	            if (user) {
	                res.json({
	                    status: 0,
	                    data: 'User already exists!'
	                });
	            } else {
	    			var md5 = crypto.createHash('md5');        	
	                var userModel = new User();
	                var password = md5.update(req.body.password).digest('base64');
	                userModel.loginName = req.body.loginName;
	                userModel.password = password; 
	                //userModel.realName = req.body.realName;
	                userModel.role = req.body.role||100;
	                userModel.save(function(err, user) {
	                    var token = createToken(user)
	                    res.json({
                            status: 1,
                            data: user,
                            token:token
                        });
	                })
	            }
	        }
	    });
	});

	app.post('/modify', ensureAuthorized, checkIsAdmin, function(req, res, next) {
	    User.update({_id:req.body.id}, {$set:{role:req.body.role, realName:req.body.realName}},function(err, user) {
	        if (err) {
                res.json({
                    status: 0,
                    data: 'Error occured: ' + err
                });   
	        }else{

                res.json({
                    status: 1,
                    data: req.body.loginName + 'is updated!'
                }); 
	        }
	    });
	});

	app.post('/delete', ensureAuthorized, checkIsAdmin, function(req, res, next) {
	    User.remove({_id:req.body.id},function(err, user) {
	        if (err) {
                res.json({
                    status: 0,
                    data: 'Error occured: ' + err
                });   
	        }else{
                res.json({
                    status: 1,
                    data: req.body.loginName + 'is removed!'
                }); 
	        }
	    });
	});	

	app.get('/role', ensureAuthorized, checkIsAdmin, function(req, res, next) {
		Role.queryAll(function(err, docs) {
	        res.json({
	            status: 1,
	            data: docs
	        });
    	})
	})

	app.post('/pageUser', ensureAuthorized, checkIsAdmin, function(req, res, next) {
	    var cp = req.body.cp - 1;
	    var ps = req.body.ps;
	    var userModel = new User();
	    User.page(cp*ps, ps, function(err, users) {
	        if (!users || users.length==0) {
                res.json({
                    status: 0,
                    data: []
                }); 
	        }else{
	        	User.queryAll(function(err, docs) {
	                res.json({
	                    status: 1,
	                    data: {
	                    	users:users,
	                    	records:docs.length
	                    }
	                });  	
	        	})
     	
	        }

	    });
	});	
}
// module.exports = router;
