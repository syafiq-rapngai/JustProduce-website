const express = require('express');
const bodyParser= require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
var session = require('express-session');
const crypto = require('crypto');
const app = express.Router();
var fs = require('fs');
var async = require("async");

const authTokens = {};

// ========================Functions==================================

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateImageUrl = () => {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 5; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   //console.log(result)
   return result;
}

const generateImageName = () => {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 10; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   //console.log(result)
   return result;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const generateSec = () => {
    return crypto.randomBytes(34).toString('hex');
}

var authentication = (user,res) => {
	if(user)
		return true
	else{
		res.redirect('/login')
	}

}

app.use(session({secret: generateSec(), saveUninitialized: true, resave: true, rolling: true, cookie: {maxAge: 28800000}}))

app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.session.authToken;

    // Inject the user to the request
    req.user = authTokens[authToken];
    next();
});

// ======================================================================

app.get('/login', (req,res) => {
	res.render('pages/protected/login',{title: "Admin Login"})
});

app.get('/dashboard', (req,res) => {
    if(authentication(req.user,res)){
        db.collection('products').find().toArray((err,results) => {
            res.render('pages/protected/dashboard',{products: results, title: "Dashboard"})
        })
    }
});

app.get('/add_sku', (req, res) => {
    if(authentication(req.user,res)){
        res.render('pages/protected/add_sku', {title: "Add SKU"});
    } 
});

app.get('/edit_sku/:id', (req, res) => {
    if(authentication(req.user,res)){
    	var locals = {}
    	var tasks = [
    	function(callback){
    		db.collection('products').findOne({_id: ObjectId(req.params.id)}, function(err,product){
            locals.product = product;
            //console.log("locals product" + locals.product)
            callback();
        })},

    	function(callback){
    		db.collection('ingredients').find().toArray(function(err,ingredients){
    			locals.ingredients = ingredients
    			//console.log("locals ingredients" + locals.ingredients)
    			callback();
    		})
    	}
    	];

    	async.parallel(tasks, function(err, results){
    		if(err) return next(err)
    		if(locals.product != null)
    		{
    			res.render('pages/protected/edit_sku',{product: locals.product, ingredients: locals.ingredients, title: "Edit SKU: " + locals.product.name})
    		}else{
    			res.redirect('/404')
    		}
    	})
    }
});

app.get('/logout', (req,res) => {
    res.clearCookie('AuthToken');
    req.session.destroy(function(err){
    	res.redirect("/");
    })
    
})

app.get('/view_orders', (req, res) => {
    if(authentication(req.user,res)){
        db.collection('orders').find().toArray(function(err,results){
        if (err) return console.log(err)
        // renders products.ejs
        res.render('pages/view-orders',{orders : results, title: "View Orders"})
        })
    }
})

app.get('/partners', (req,res) => {
    if(authentication(req.user,res)){
        db.collection('companies').find().toArray(function(err, results) {
           res.render('pages/protected/companies',{companies: results}) 
        })
    }
})

app.get('/add_partner', (req,res) => {
    if(authentication(req.user,res)){
    res.render('pages/protected/add_partner') 
    }
})

app.get('/edit_partner/:id', (req,res) => {
    if(authentication(req.user,res)){
        db.collection('companies').findOne({_id: ObjectId(req.params.id)},function(err, results) {
           res.render('pages/protected/edit_partner',{company: results}) 
        })
    }
})

// -----------------------------------------POST--------------------------------

app.post('/login', (req,res) => {

	const { username, password } = req.body;
    

    db.collection('users').findOne({username: username}, (err,user) => {
    	if(user) {

            const hashedPassword = getHashedPassword(user["pepper"] + password);
            // console.log(user["pepper"] + " " + password)
            // console.log(hashedPassword)
            if(hashedPassword == user["password"])
            {
                const authToken = generateAuthToken();

                // Store authentication token
                authTokens[authToken] = user;

                // Setting the auth token in cookies
                //res.cookie('AuthToken', authToken, {maxAge: 3600000});
                req.session.authToken = authToken;

                // Redirect user to the protected page
                res.redirect('/dashboard');
            }
    		
    	}else {
	        res.render('pages/protected/login', {
	            message: 'Invalid username or password',
	            messageClass: 'alert-danger',
                title: "Login"
	        });
	    }
    });
    
})

app.post('/update_paid', (req, res) => {
    db.collection('orders').findOneAndUpdate({_id : ObjectId(req.body._id)} , {$set : {payment: true} }, (req, result) => {
        res.send({message : "Ajax success"})
    })
})

app.post('/update_collected', (req, res) => {
    db.collection('orders').findOneAndUpdate({_id : ObjectId(req.body._id)} , {$set : {collected: true} }, (req, result) => {
        res.send({message : "Ajax success"})
    })
})

app.post('/add_sku', (req, res) => {
    if(authentication(req.user,res)){
        // remove whitespaces
        req.body.imageurl = generateImageUrl()


        if (req.files.image && Object.keys(req.files).length != 0) {
            let imagefile = req.files.image;
            let path = './public/img/products/'+req.body.imageurl;

            if (!fs.existsSync(path)){
			    fs.mkdirSync(path);
			}

            imagefile.mv(path+'/Thumbnail.jpg', (err) => {
                console.log(err);
            })
        }

        var imageArray = [];

        if (req.files.multiple_image && Object.keys(req.files.multiple_image).length != 0) {
            let imagefiles = req.files.multiple_image;
            let path = './public/img/products/'+req.body.imageurl;

            if (!fs.existsSync(path)){
                fs.mkdirSync(path);
            }

            try{
                let imageName = generateImageName()
                
                imagefiles.mv(path+'/'+ imageName +'.jpg', (err) => {
                    console.log(err);
                })
                imageArray.push(imageName)
                
            }catch(err){
                for(var i=0; i<imagefiles.length; i++){
                    let imageName = generateImageName()
                    
                    imagefiles[i].mv(path+'/'+ imageName +'.jpg', (err) => {
                        console.log(err);
                        
                    })
                    imageArray.push(imageName)
                }
            }

            
            

        }

        req.body.images = imageArray
        // Generate JSON array from ingredients list
        req.body.ingredients = "[" + req.body.ingredients + "]"
        //console.log(req.body.ingredients);
        req.body.ingredients = JSON.parse(req.body.ingredients);
        delete req.body.ingre_name
        delete req.body.ingre_desc

        req.body.url = (req.body.name).replace(" ","-")
        db.collection('products').insertOne(req.body, (err, result) => {
            if (err) return console.log(err)
            res.render('pages/protected/add_sku',{message: "New SKU: " + req.body.name + " has been added.", class: "message", title: "Add SKU"})
        });
    }
});

app.post('/add_partner', (req,res) => {
    if(authentication(req.user,res)){
        // remove whitespaces

        if(req.files != null){
            if (req.files.image && Object.keys(req.files).length != 0) {
                let imagefile = req.files.image;
                let path = './public/img/vendor-logos/';

                if (!fs.existsSync(path)){
                    fs.mkdirSync(path);
                }

                imagefile.mv(path+'/'+req.body.name+'.png', (err) => {
                    console.log(err);
                })
            }
        }

        req.body.image = req.body.name + ".png"

        db.collection('companies').insertOne(req.body, (err, result) => {
            if (err) return console.log(err)
            res.render('pages/protected/add_partner',{message: "New Partner Added: " + req.body.name + " has been added.", class: "message"})
        });
    }
})

app.post('/edit_partner/:id', (req,res) => {
    if(authentication(req.user,res)){
        // remove whitespaces

        if(req.files != null){
            // console.log("Entered")
            if (req.files.image && Object.keys(req.files).length != 0) {
                let imagefile = req.files.image;
                let path = './public/img/vendor-logos/';

                if (!fs.existsSync(path)){
                    fs.mkdirSync(path);
                }

                imagefile.mv(path+'/'+req.body.name+'.png', (err) => {
                    console.log(err);
                })
            }
        }

        db.collection('companies')
      .findOneAndUpdate({_id: ObjectId(req.params.id)}, {
        $set: {
          name: req.body.name,
          url: req.body.url
        }
          }, {
            returnOriginal:false
          }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/partners')
          })
    }
})

app.post('/image_upload', (req, res) => {
    const id = req.body.id;
    const image = req.files.image;
    
    db.collection('products').findOne({_id: ObjectId(id)}, (req, result) => {
        image.mv('./public/img/products/'+result.name.replace(/\s/g,'')+'.jpg', (err) => {
            if(err) console.log(err)
            res.redirect('/admin_menu')
        }) 
    })
})

// DELETE

app.delete('/products', (req, res) => {
    //console.log("ID: " + req.body.id);
  db.collection('products').deleteOne({_id: ObjectId(req.body.id)},
  (err, result) => {
    if (err) return res.send(500, err)
    return res.send(result)
  })
})

app.delete('/edit_partner', (req, res) => {
    //console.log("ID: " + req.body.id);
  db.collection('companies').deleteOne({_id: ObjectId(req.body.id)},
  (err, result) => {
    if (err) return res.send(500, err)
    return res.send(result)
  })
})

app.delete('/delete_order', (req, res) => {
    db.collection('orders').deleteOne({_id: ObjectId(req.body.id)},
  (err, result) => {
    if (err) return res.send(500, err)
    return res.send(result)
  })
})

// PUT
app.post('/edit_sku/:id', (req, res) => {
    
    

    req.body.imageurl = req.body.imageurl
    var imageArray = [];


    if(req.files != null){
        if (req.files.image != null  && Object.keys(req.files.image).length != 0) {
            let imagefile = req.files.image;

            imagefile.mv('./public/img/products/'+req.body.imageurl+'/Thumbnail.jpg', (err) => {
                console.log(err);
            })
        }


       
       if (req.files.multiple_image && Object.keys(req.files.multiple_image).length != 0) {
            var imagefiles = req.files.multiple_image;
            var path = './public/img/products/'+req.body.imageurl;

            

            if (!fs.existsSync(path)){
                fs.mkdirSync(path);
            }

            var start = parseInt(req.body.imagesLength)

            try{
                let imageName = generateImageName()
                
                imagefiles.mv(path+'/'+ imageName +'.jpg', (err) => {
                    console.log(err);
                })

                imageArray.push(imageName)
                
            }catch(err){
                console.log(imagefiles)
                for(var i=0; i<imagefiles.length; i++){
                    let imageName = generateImageName()
                    
                    imagefiles[i].mv(path+'/'+ imageName +'.jpg', (err) => {
                        console.log(err);
                    })
                    imageArray.push(imageName)
                }
            }
            

        }

    }



    req.body.ingredients = "[" + req.body.ingredients + "]"
    //console.log(req.body);
    req.body.ingredients = JSON.parse(req.body.ingredients);
    delete req.body.ingre_name
    delete req.body.ingre_desc
    req.body.url = (req.body.name).replace(" ","-")



    db.collection('products')
  .findOneAndUpdate({_id: ObjectId(req.params.id)}, {
    $set: {
      name: req.body.name,
      synopsis: req.body.synopsis,
      weight: req.body.weight,
      description: req.body.description,
      ingredients: req.body.ingredients,
      dimension: req.body.dimension,
      storage: req.body.storage,
      remarks: req.body.remarks,
      imageurl: req.body.imageurl,
      url: req.body.url
    },
    $push : {
        images : {$each : imageArray}
    }
  }, {
    returnOriginal:false
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/dashboard')
  })

});

app.post('/delete_image', (req, res) => {
    var id = req.body.id
    var imageName = req.body.imageName

    db.collection('products')
    .findOneAndUpdate({_id : ObjectId(id)}, {
        $pull: {
            images: imageName
        }
    })

    res.send({message: "Deleted"})

});

module.exports = app;