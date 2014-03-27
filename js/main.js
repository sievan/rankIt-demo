app.banner = new app.Banner();
var bannerView = new app.BannerView({model: app.banner});

app.rankList = new app.RankList();

var appView = new app.AppView({
  collection: app.rankList});

// Connect to socket
// When the list is updated, print out the new list
var rankObjects = {};
var socket = io.connect('/');
socket.on('banner', function(data){
	app.banner.set({heading: data.heading, subheading: data.subheading});
});
socket.on('newList', function(data) {
  appView.removeAll();
  for(var id in data) {
    app.rankList.create({title: data[id].title, votes: data[id].votes, id: id});
  }
  appView.addAll();
});
socket.on('newUpVote', function(data) {
  app.rankList.upVoteObject(data);
});
