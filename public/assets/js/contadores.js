var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var loadJsonFile = require('load-json-file');

/*
var emoji = require('node-emoji');
var emojiJSON = require('./emoji.json');
var emojiArr = [];
*/
var redis = require('redis');
var clientr = redis.createClient({port:'6379',host:'127.0.0.1',password:'perritosabroson'});

clientr.on('connect', function() {
    console.log('connected');
});

clientr.on("error", function (err) {
    console.log("Error " + err);
});

var elastic = require('../elasticsearch/connection.js');

var url = 'mongodb://localhost:27017/social-hound-twitter';

var init = (function() {
    return require('./bd.js');
})();

MongoClient.connect(url, function(err, db) {
	console.log("connected to MongoDB");

	/* CONTADORES */

	router.get('/count/:topic', function(req, res, next) {
		if(req.params.topic!=12) {
			clientr.get("count"+req.params.topic,function(err,reply) {
				var query = {};
				query.topic = req.params.topic;
				query.name = req.params.topic;
				//Aquí se arma el contador
				query.id = 'socialhounitem1';
				query.count = parseInt(reply);
				query.percent = parseInt(reply);
				query.date = new Date();
				var result = { data: []} ;
				result.data.push(query);
			  	res.send(result);
			});
		} else {
			clientr.get("countdiana",function(err,reply) {
				var query = {};
				query.topic = "#DianaEnEl13";
				query.name = "#DianaEnEl13";
				//Aquí se arma el contador
				query.id = 'socialhounitem1';
				query.count = parseInt(reply);
				query.percent = parseInt(reply);
				query.date = new Date();
				var result = { data: []} ;
				result.data.push(query);
			  	res.send(result);
			});
		}
	});

	router.get('/gender/:topic/:gender', function(req, res, next) {
		clientr.get(req.params.gender+req.params.topic,function(err,reply) {
			var query = {};
			query.topic = req.params.topic;
			query.name = req.params.topic;
			query.gender = req.params.gender;
			//Aquí se arma el contador
			query.id = 'socialhounitem1';
			query.count = parseInt(reply);
			query.percent = parseInt(reply);
			query.date = new Date();
			var result = { data: []} ;
			result.data.push(query);
		  	res.send(result);
		});
	});

	router.get('/emotion/:topic/:emotion', function(req, res, next) {
		clientr.get(req.params.emotion+req.params.topic,function(err,reply) {
			var query = {};
			query.topic = req.params.topic;
			query.name = req.params.topic;
			query.emotion = req.params.emotion;
			//Aquí se arma el contador
			query.id = 'socialhounitem1';
			query.count = parseInt(reply);
			query.percent = parseInt(reply);
			query.date = new Date();
			var result = { data: []} ;
			result.data.push(query);
		  	res.send(result);
		});
	});

	/*

	router.get('/countg/:topic/:gender', function(req, res, next) {
		getCountMongo(req, res, next);
	});

	router.get('/count/all/:query', function(req, res, next) {
		getCountMongo(req, res, next);
	});

	router.get('/countg/all/:query/:gender', function(req, res, next) {
		getCountMongo(req, res, next);
	});

	router.get('/count/:topic/:query', function(req, res, next) {
		getCountMongo(req, res, next);
	});

	router.get('/countquery/:topic/:query', function(req, res, next) {
		getCountMongoQuery(req, res, next);
	});

	router.get('/countqueryg/:topic/:query/:gender', function(req, res, next) {
		getCountMongoQuery(req, res, next);
	});

	router.get('/countquerye/:topic/:query/:emotion', function(req, res, next) {
		getCountMongoQuery(req, res, next);
	});

	router.get('/countg/:topic/:query/:gender', function(req, res, next) {
		getCountMongo(req, res, next);
	});

	/* CONTADORES */

	/* INVITADOS */
	router.get('/guests/:guest', function(req, res, next) {
		getGuestsMongo(req, res, next);
	});

	router.get('/guests-all/:topic', function(req, res, next) {
		getAllGuestsMongo(req, res, next);
	});

	/* EMOCIONES */
	/*
	router.get('/emotion/:topic/:emotion', function(req, res, next) {
		getCountMongo(req, res, next);
	});

	router.get('/emotion/:topic/:query/:emotion', function(req, res, next) {
		getCountMongo(req, res, next);
	});

	router.get('/emotion/:topic/:query/:gender/:emotion', function(req, res, next) {
		getCountMongo(req, res, next);
	});

	router.get('/emotiong/:topic/:gender/:emotion', function(req, res, next) {
		getCountMongo(req, res, next);
	});

	/* EMOCIONES */

	/* HITS */
	/*
	router.get('/hits/:topic', function(req, res, next) {
		getHits(req, res, next);
	});

	router.get('/hitsg/:topic/:gender', function(req, res, next) {
		getHits(req, res, next);
	});

	router.get('/hits/all/:query', function(req, res, next) {
		getHits(req, res, next);
	});

	router.get('/hitsg/all/:query/:gender', function(req, res, next) {
		getHits(req, res, next);
	});

	router.get('/hits/:topic/:query', function(req, res, next) {
		getHits(req, res, next);
	});

	router.get('/hitsg/:topic/:query/:gender', function(req, res, next) {
		getHits(req, res, next);
	});

	/* HITS */

	/* CLOUD */
	/*
	router.get('/cloud/:topic/:size', function(req, res, next) {
		getCloud(req,res,next);
	});

	router.get('/cloudg/:topic/:gender/:size', function(req, res, next) {
		getCloud(req,res,next);
	});

	router.get('/cloud/all/:query/:size', function(req, res, next) {
		getCloud(req,res,next);
	});

	router.get('/cloudg/all/:query/:gender/:size', function(req, res, next) {
		getCloud(req,res,next);
	});

	router.get('/cloud/:topic/:query/:size', function(req, res, next) {
		getCloud(req,res,next);
	});

	router.get('/cloudg/:topic/:query/:gender/:size', function(req, res, next) {
		getCloud(req,res,next);
	});

	/* CLOUD */

	/* EMOJIS */
	/*
	router.get('/emoji/:topic',function(req,res,next) {
		getCountEmoji(req,res,next);
	});

	router.get('/emojisort/:topic',function(req,res,next) {
		var emojiJSONcandidato = require('./'+req.params.topic+'.json');

		emojiJSONcandidato.sort(function(a, b) {
		    return parseFloat(b.count) - parseFloat(a.count);
		});

		res.send(emojiJSONcandidato);
	});
	/* EMOJIS */

	var getCountEmoji = function(req,res,next) {
		init.then(connection=>{
			var result = [];
			emojiArr = [];
		    statuses = connection.collection('statuses');
		    for (var key in emojiJSON) {
			  emojiArr.push({name:key,emoji:emojiJSON[key]});
			}

			var mustArr = {};
		    if(parseInt(req.params.topic)) {
				var topics = db.collection('topics');
				mustArr["$or"] = [];
				topics.findOne({_id:parseInt(req.params.topic)},function(error, item) {
					item.queries.forEach(function(query) {
						mustArr["$or"].push({text: new RegExp(".*"+query.query+".*")});
					});
		    		getCountEmojiRecursive(statuses,0,emojiArr,req,res,mustArr,result);
				});
			} else if(isNaN(parseInt(req.params.topic))&&req.params.topic) {
				var topics = db.collection('topics');
				mustArr["$or"] = [];
				topics.findOne({name:req.params.topic},function(error, item) {
					item.queries.forEach(function(query) {
						mustArr["$or"].push({text: new RegExp(".*"+query.query+".*")});
					});
		    		getCountEmojiRecursive(statuses,0,emojiArr,req,res,mustArr,result);
				});
			}
		} )
		    .catch(err => {
		    console.log("Error"+ err);
		});
	}

	var getCountEmojiRecursive = function(statuses,index,arr,req,res,mustArr,result) {
		console.log(index+'/'+arr.length);
		if(index<arr.length) {
			var icon = arr[index];
			var isValid = true;
			try {
			    new RegExp(".*"+icon.emoji+".*");
			} catch(e) {
			    isValid = false;
			}
			if(isValid) {
				mustArr["$and"] = [{ text: new RegExp(".*"+icon.emoji+".*") }];
				statuses.find(mustArr).toArray(function(err,items) {
					if(err) {
						getCountEmojiRecursive(statuses,index+1,emojiArr,req,res,result);
					} else {
			  		    icon.count = items.length;
			  		    if(items.length) {
			  		    	icon.status = items[0]._id;
			  		    }
			  		    console.log(icon.emoji+'('+icon.name+')'+': '+icon.count);
			  		    result.push(icon);
		  		    	getCountEmojiRecursive(statuses,index+1,emojiArr,req,res,mustArr,result);
					}
		  		});
			} else {
				getCountEmojiRecursive(statuses,index+1,emojiArr,req,res,mustArr,result);
			}
		} else {
			console.log(result);
			res.send(result);
		}
	}

	var getCountMongo = function(req,res,next) {
		var mustArr = {};
		if(req.params.query) {
			mustArr.text = new RegExp(".*"+req.params.query+".*");
	    }

		if(req.params.gender) {
			mustArr.gender = req.params.gender;
	    }

    	if(req.params.emotion) {
    		mustArr["emotion.vote"] = req.params.emotion;
        }

	    if(parseInt(req.params.topic)) {
			var topics = db.collection('topics');
			mustArr["$or"] = [];
			topics.findOne({_id:parseInt(req.params.topic)},function(error, item) {
				item.queries.forEach(function(query) {
					console.log(query.query);
					mustArr["$or"].push({text: new RegExp(".*"+query.query+".*")});
				});
	    		queryMongo(res,mustArr,item.name,req.params.query,item);
			});
		} else if(isNaN(parseInt(req.params.topic))&&req.params.topic) {
			var topics = db.collection('topics');
			mustArr["$or"] = [];
			topics.findOne({name:req.params.topic},function(error, item) {
				item.queries.forEach(function(query) {
					console.log(query.query);
					mustArr["$or"].push({text: new RegExp(".*"+query.query+".*")});
				});
	    		queryMongo(res,mustArr,item.name,req.params.query,item);
			});
		}
	}

	var getCountMongoQuery = function(req,res,next) {
		var mustArr = {};
		if(req.params.query) {
			var queries = req.params.query.split(",");
			mustArr["$or"] = [];
			for(var i=0;i<queries.length;i++) {
				mustArr["$or"].push({text:new RegExp(".*"+queries[i]+".*")});
			}
	    }

		if(req.params.gender) {
			mustArr.gender = req.params.gender;
	    }

    	if(req.params.emotion) {
    		mustArr["emotion.vote"] = req.params.emotion;
        }

	    if(parseInt(req.params.topic)) {
			var topics = db.collection('topics');
			topics.findOne({_id:parseInt(req.params.topic)},function(error, item) {
				item.queries.forEach(function(query) {
					//mustArr["$or"].push({text: new RegExp(".*"+query.query+".*")});
				});
	    		queryMongo(res,mustArr,item.name,req.params.query,item);
			});
		} else if(isNaN(parseInt(req.params.topic))&&req.params.topic) {
			var topics = db.collection('topics');
			topics.findOne({name:req.params.topic},function(error, item) {
				item.queries.forEach(function(query) {
					//mustArr["$or"].push({text: new RegExp(".*"+query.query+".*")});
				});
	    		queryMongo(res,mustArr,item.name,req.params.query,item);
			});
		}
	}

	var getGuestsMongo = function(req,res,next) {
		var mustArr = {};
	    if(parseInt(req.params.guest)) {
			var guests = db.collection('guests');
			mustArr["$or"] = [];
			guests.findOne({_id:parseInt(req.params.guest)},function(error, item) {
				res.send(item);
			});
		} else if(isNaN(parseInt(req.params.guest))&&req.params.guest) {
			var guests = db.collection('guests');
			mustArr["$or"] = [];
			guests.findOne({name:req.params.guest},function(error, item) {
				res.send(item);
			});
		}
	}

	var getAllGuestsMongo = function(req,res,next) {
		var guests = db.collection('guests');
		console.log(req.params.topic);
		guests.find({ '$and': [ {topic:req.params.topic},{active:true}]}).toArray(function(error, item) {
			res.send(item);
		});
	}


	var getCount = function(req,res,next) {
		var mustArr = [];
		if(req.params.query) {
			mustArr.push({ 
              	"match": { 
              		"text":  "%"+req.params.query+"%"  
              	}
              });
	    }

		if(req.params.gender) {
			mustArr.push({ 
              	"match": { 
              		"gender":  "%"+req.params.gender+"%"  
              	}
              });
	    }

	    if(parseInt(req.params.topic)) {
			var topics = db.collection('topics');
			topics.find({_id:parseInt(req.params.topic)}).toArray(function(error, item) {
	    		mustArr.push({ 
                  	"match": { 
                  		"query": "%"+item[0].name+"%"
                  	}
                  });
	    		queryElastic(res,mustArr,item[0].name,req.params.query);
			});
		} else if(isNaN(parseInt(req.params.topic))&&req.params.topic) {
			mustArr.push({ 
	                  	"match": { 
	                  		"query": "%"+req.params.topic+"%"
	                  	}
	                  });
			queryElastic(res,mustArr,req.params.topic,req.params.query);
		}
	}

	var getHits = function(req,res,next) {
		var mustArr = [];
		if(req.params.query) {
			mustArr.push({ 
              	"match": { 
              		"text":  "%"+req.params.query+"%"  
              	}
              });
	    }

		if(req.params.gender) {
			mustArr.push({ 
              	"match": { 
              		"gender":  "%"+req.params.gender+"%"  
              	}
              });
	    }

	    if(parseInt(req.params.topic)) {
			var topics = db.collection('topics');
			topics.find({_id:parseInt(req.params.topic)}).toArray(function(error, item) {
	    		mustArr.push({ 
                  	"match": { 
                  		"query": "%"+item[0].name+"%"
                  	}
                  });
	    		queryElasticHits(res,mustArr,item[0].name,req.params.query);
			});
		} else if(isNaN(parseInt(req.params.topic))&&req.params.topic) {
			mustArr.push({ 
	                  	"match": { 
	                  		"query": "%"+req.params.topic+"%"
	                  	}
	                  });
			queryElasticHits(res,mustArr,req.params.topic,req.params.query);
		}
	}

	var queryMongo = function(res,mustArr,topic,querystr,topicitem) {
		var query = {};

		var statuses = db.collection('statuses');
		statuses.count(mustArr,function(error, item) {
			query.topic = topic;
			query.name = topic;
			if(querystr) {
				query.query = querystr;
			}
			if(!querystr&&!mustArr["emotion.vote"]) {
				query.item = topicitem;
			}
			//Aquí se arma el contador
			query.id = 'socialhounditem1';
			query.count = parseInt(item);
			query.percent = parseInt(item);
			query.date = new Date();
			var result = { data: []} ;
			result.data.push(query);
		  	res.send(result);
		});
	}

	var queryElastic = function(res,mustArr,topic,querystr) {
		var query = {};
		elastic.search({  
		  index: 'statuses',
		  type: 'status',
		  body: {
		    "query": {
		        "bool": {
		          "must": mustArr
		        }
		      }
		  }
		},function (error, response,status) {
		    if (error){
		      console.log("search error: "+error)
		    }
		    else {
		    	query.topic = topic;
		    	if(querystr) {
		    		query.query = querystr;
		    	}
		    	query.count = response.hits.total;
		      	res.send(query);
		    }
		});
	}

	var queryElasticHits = function(res,mustArr,topic,querystr) {
		var query = {};
		elastic.search({  
		  index: 'statuses',
		  type: 'status',
		  body: {
		    "query": {
		        "bool": {
		          "must": mustArr
		        }
		      }
		  }
		},function (error, response,status) {
		    if (error){
		      console.log("search error: "+error)
		    }
		    else {
		    	query.topic = topic;
		    	if(querystr) {
		    		query.query = querystr;
		    	}
		    	query.hits = response.hits.hits;
		    	query.count = response.hits.hits.length;
		      	res.send(query);
		    }
		});
	}

	var getCloud = function(req,res,next) {
		var excludeWords = [
		  'y', 'o', 'a', 'la', 'el', 'las', 'los', 'lo', 'rt', 'de', 'en', 'https', 'http', 't.co', 'que', 'no', 'con', 'se', 'por', 'es', 'me', 'un', 'mi', 'q', 'ya', 'le', 'va', 'del', 'te', 'su', 'yo', 'tu', 'al'
		];

		var mustArr = [];
		if(req.params.query) {
			mustArr.push({ 
	                  	"match": { 
	                  		"text":  "%"+req.params.query+"%"  
	                  	}
	                  });
		}

		if(req.params.gender) {
			mustArr.push({ 
              	"match": { 
              		"gender":  "%"+req.params.gender+"%"  
              	}
              });
	    }

	    if(parseInt(req.params.topic)) {
			var topics = db.collection('topics');
			topics.find({_id:parseInt(req.params.topic)}).toArray(function(error, item) {
	    		mustArr.push({ 
                  	"match": { 
                  		"query": "%"+item[0].name+"%"
                  	}
                  });
	    		queryElasticCloud(req,res,mustArr,excludeWords,item[0].name,req.params.query);
			});
		} else if(isNaN(parseInt(req.params.topic))&&req.params.topic) {
			mustArr.push({ 
	                  	"match": { 
	                  		"query": "%"+req.params.topic+"%"
	                  	}
	                  });
			queryElasticCloud(req,res,mustArr,excludeWords,req.params.topic,req.params.query);
		}
	}

	var queryElasticCloud = function(req,res,mustArr,excludeWords,topic,querystr) {
		elastic.search({
		  index: 'statuses',
		  type: "status",
		  body: {
		    "query": {
		        "bool": {
		          "must": mustArr
		        }
		      },
		    aggs: {
                status: {
                    terms: {
                        field: "text",
                        exclude: excludeWords,
                        size: req.params.size
                    }
                }
            }
		  }
		}).then(function (resp) {
		  var wordArr = resp.aggregations.status.buckets;
		  var cloudArr = [];
		  wordArr.forEach(function(word) {
		  	cloudArr.push(word.key);
		  });
		  res.send(cloudArr.join(" | "));
		}, function (err) {
		  console.log(err);
		});
	}

	var getGender = function(name,screen_name,callback) {
	    var nameGender = gender.detect(name);
	    var screenGender;
	    if(nameGender=='unknown'||nameGender=='unisex') {
	    	screenGender = gender.detect(screen_name);
	    	if(screenGender=='unknown'||screenGender=='unisex') {
	    		nameGender = genderinf.infer(name);
	    		nameGender = nameGender.gender;
	    		if(nameGender==null) {
	    			screenGender = genderinf.infer(screen_name);
	    			screenGender = screenGender.gender;
	    			if(screenGender==null) {
	    				nameGender = genderes.genderForNoun(name)=='f'?'female':'male';
	    			}	
	    		}
	    	}
	    }
	    callback(nameGender!='unknown'?nameGender:screenGender);
	}
});

module.exports = router;
