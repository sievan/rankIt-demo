/*  Contains views for the rankObjects and for the list.
*/

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
    this.animate();
  },
  animate: function() {
    // stop() Removes the previous animation from the queue, and jumps to the end of the previous animation
    this.$el.stop(true,true).animate({
      width:'+=40',
      backgroundColor:'#8e8'
    },50);
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
    this.animate();
  },
  animate: function() {
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