var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	//locals.section = 'blog';
	locals.section = req.params.category;
	locals.data = {
		posts: [],
		displaySection: locals.secNames[locals.section]
	};


	// Load all categories
	//view.on('init', function (next) {

	//	keystone.list('Category').model.find().sort('name').exec(function (err, results) {

	//		if (err || !results.length) {
	//			return next(err);
	//		}

	//		locals.data.categories = results;

	//		// Load the counts for each category
	//		async.each(locals.data.categories, function (category, next) {

	//			keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
	//				category.postCount = count;
	//				next(err);
	//			});

	//		}, function (err) {
	//			next(err);
	//		});
	//	});
	//});

	// count posts of this category
	//view.on('init', 
	//	function(next){
	//		async.each([res.params.category], function (category, next) {

	//			keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
	//				category.postCount = count;
	//				next(err);
	//			});

	//		}, function (err) {
	//			next(err);
	//		});
	//	}
	//);

	// Load the current category filter
	//view.on('init', function (next) {

	//	if (req.params.category) {
	//		keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
	//			locals.data.category = result;
	//			next(err);
	//		});
	//	} else {
	//		next();
	//	}
	//});

	// Load the posts
	view.on('init', function (next) {

		var q = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
				categories: req.params.category,
			},
		})
			.sort('-publishedDate')
			.populate('author');
			//.where("categories").in([req.params.category]);

		//if (locals.data.category) {
		//	q.where('categories').in([locals.data.category]);
		//}

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('blog');
};
