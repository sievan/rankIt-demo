// Banner at the top
app.Banner = Backbone.Model.extend({
  defaults: {
  	heading: 'Loading...',
  	subheading: ''
  }
});

app.BannerView = Backbone.View.extend({
  el: "#heading",
  template: _.template($('#heading-template').html()),
  initialize: function() {
    this.model.on('change', this.render, this);
    this.addHeading();
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  addHeading: function() {
  	$('#heading').html('');
  	$('#heading').append(this.render().el);
  }
});