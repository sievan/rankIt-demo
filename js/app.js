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


// Views

// View for a single rank element
app.RankView = Backbone.View.extend({
  className: 'listBox',
  template: _.template($('#item-template').html()),
  events: {
    'click #clickButton': 'upVote'
  },
  initialize: function() {
    this.model.on('change', this.update, this);
    this.$el.css({"width": 300})
  },
  upVote: function() {
    socket.emit('upVote', this.model.get('id'));
  },
  update: function() {
    this.render();
    this.$el.stop(true,true).animate({
      width:'+=40',
      backgroundColor:'#8e8'
    },50);
    // stop() Removes the previous animation from the queue, but does not jump to the end of the previous animation
    this.$el.stop(true,true).animate({
      width:'-=40',
      backgroundColor:'#eee'
    },300);
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

// View for the whole list
app.AppView = Backbone.View.extend({
  el: '#ranked-list',
  initialize: function() {
    this.collection.on('add', this.addItem, this);
    this.collection.on('change', this.update, this);
  },

  addItem: function(rank) {
    var view = new app.RankView({model: rank});
    $('#ranked-list').append(view.render().el);
  },

  // Remove all from view, add all from collection and animate all views
  addAll: function() {
    $('#ranked-list').html('');
    this.collection.sort();
    this.collection.each(this.addItem, this);
    $('.viewText').fadeOut(100);
    // stop() Removes the previous animation from the queue, but does not jump to the end of the previous animation
    $(".listbox").animate({
      width:'+=40',
      backgroundColor:'#cce'
    },100);
    $(".listbox").animate({
      width:'-=40px',
      backgroundColor:'#eee'
    },300);
    $('.viewText').fadeIn(700);
  },

  removeAll: function() {
    $('#ranked-list').html('');
    this.collection.reset();
  },

  update: function() {
    if(!this.collection.isSorted()){
      this.addAll();
    }
  }
});



