(function(window, undefined){

	if ( window.Backbone === undefined )
		throw("[Backbone.CModel] Backbone not detected.");

	Backbone.CModel = Backbone.Model.extend({

		// c is a hash of the computed properties you wan to add to your
		// model. A computed property can be an array of existing attribute names 
		// or a function. They'll be handled like this:
		// 
		// * Array of existing attribute strings will be joined with a space. Useful
		//   for simple combination of existing attributes, such as firstName and lastName.
		//   
		//   ex: On a model with attributes firstName and lastName, you would set a 
		//       a computed property of fullName like so:  
		// 		
		//      c: { fullName: ['firstName', 'lastName'] }
		// 
		// * Functions are passed a json representation of the model and should return
		//   the value of the computed attribute.
		// 
		//	ex: Set a `fullName` computed property, same as above:
		//      c: {
		//		  fullName: function(attrs) {
		// 		  	return attrs.firstName +' '+ attrs.lastName;
		// 		  }
		//		}

		c: {},

		getC: function(attr) {
			var _this = this,
				json = this.toJSON();

			if ( _.isArray(attr) ) {
				return _.object(attr, _.map(attr, function(a) {
					return _this.getC(a);
				}));
			}

			var c = this.c[attr];

			if (_.isFunction(c))
				return c(json);

			if (_.isArray(c)) {
				return _.map(c, function(val) { return _this.get(val); }).join(' ');
			}

			// c is undefined or a fixed value we can assume the author wants.
			return c;
		},

		get: function(attr) {
			if ( attr in this.c )
				return this.getC(attr);
			return Backbone.Model.prototype.get.call(this, attr);
		},

		toJSON: function(options) {
			var _this = this,
				json = Backbone.Model.prototype.toJSON.call(this),
				computedAttrs = {};
			if ( options && options.computed )
				computedAttrs = this.toCJSON({ only: true });
			return _.extend(json, computedAttrs );
		},
		toCJSON: function(options) {
			return options && options.only ? this.getC( _.keys(this.c) ) : this.toJSON({ computed: true });
		}
	});


})(window);