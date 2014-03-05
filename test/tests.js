var TestCModel = Backbone.CModel.extend({
	defaults: {
		firstName: 'Walker',
		lastName: 'Percy'
	},
	c: {
		staticAttr: 'foo',
		fullNameArray: ['firstName', 'lastName'],
		fullNameFunc: function(attrs){
			return [attrs.firstName, attrs.lastName].join(' ');
		}
	}
});

var model = new TestCModel();
var json = {
	firstName: 'Walker',
	lastName: 'Percy',
	fullNameArray: 'Walker Percy',
	fullNameFunc: 'Walker Percy',
	staticAttr: 'foo'
};

test( "Gets computed attribute set as function through native method", function() {
  equal( model.getC('fullNameFunc'), "Walker Percy", "Passed!" );
});

test( "Gets computed attribute set as array through native method", function() {
  equal( model.getC('fullNameArray'), "Walker Percy", "Passed!" );
});

test( "Gets computed attribute set as function through overridden method", function() {
  equal( model.get('fullNameFunc'), "Walker Percy", "Passed!" );
});

test( "Returns object of computed attributes if array of attribute requested", function() {
  var result = model.getC(['staticAttr', 'fullNameArray']),
  	  expectedResult = { staticAttr: 'foo', fullNameArray: 'Walker Percy' };
  ok( result && 'staticAttr' in result && 'fullNameArray' in result, 'Passed' );
});

test( "Gets computed attribute set as array through overridden method", function() {
  equal( model.get('fullNameArray'), "Walker Percy", "Passed!" );
});

test( "Returns computed JSON via native method", function() {
	var cjson = model.toCJSON();
	ok( _.isObject(cjson), "Passed!");
	['firstName', 'lastName', 'fullNameArray', 'fullNameFunc', 'staticAttr'].forEach(function(attr) {
		equal(cjson[attr], json[attr],  "Passed!");
	});
});

test( "Returns only computed JSON via native method", function() {
	var cjson = model.toCJSON({ only: true });
	ok( _.isObject(cjson), "Passed!");
	['fullNameArray', 'fullNameFunc', 'staticAttr'].forEach(function(attr) {
		equal(cjson[attr], json[attr],  "Passed!");
	});
	equal( 'firstName' in cjson, false, "Passed!" )
	equal( 'lastName' in cjson, false, "Passed!" )
});

test( "Returns computed JSON via toJSON({computed:true})", function() {
	var cjson = model.toJSON({ computed: true });
	ok( _.isObject(cjson), "Passed!");
	['firstName', 'lastName', 'fullNameArray', 'fullNameFunc', 'staticAttr'].forEach(function(attr) {
		equal(cjson[attr], json[attr],  "Passed!");
	});
});

