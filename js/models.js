/*  Contains collection and model for the rank objects
*/
var app = {}; // namespace for app

// model for an object in the ranked list
app.RankObject = Backbone.Model.extend({
  defaults: {
    id: 0,
    title: '',
    votes: 0
  }
});

// collection to represent the list
app.RankList = Backbone.Collection.extend({
  model: app.RankObject,
  comparator: function(model){
    return -model.get('votes');
  },
  localStorage: new Store("backbone-list"),
  
  // Check if collection is sorted in descending order
  isSorted: function() {
    var voteArray = this.pluck('votes');
    for(var i = 1; i < voteArray.length; i++) {
      if(voteArray[i] > voteArray[i-1]) {
        return false;
      }
    }
    return true;
  },

  // Increments votes attribute by 1
  upVoteObject: function(id) {
    var nVotes = this.get(id).get('votes');
    this.get(id).set('votes', nVotes + 1);
  }
});