var Tagger = (function(){

  // Constants
  var box = {
    size: 100,
    border: 10
  };
  var image_name = null;
  var targeter = null;
  var targeter_x = null;
  var targeter_y = null;
  var container = null;

  // "database" tables
  var tags = [];
  var names = [ "Waldo",
                "Wizard",
                "Woof",
                "Wenda",
                "Wilma",
                "Odlaw",
                "Watcher" ];

  function Tag(x, y, name, image_name){
    this.x = x;
    this.y = y;
    this.name = name;
    this.image_name = image_name;

    this.save = function(callback){
      console.log("SAVED!!!")

      if(callback) {
        callback();
      }
    }
  }

  // The initial setup function
  function Initializer(container){
    Tagger.container = container;
    var image = container.find("img");
    Tagger.image_name = image.attr('name');
    var that = this;
    console.log(Tagger.tags);

    this.render = function(){
      Tagger.buildTagTargeter(container);
      image.click(Tagger.targetTag);
      console.log(Tagger.hideTags);
      image.hover(Tagger.showTags, Tagger.hideTags);
    };
  }

  function targetTag(event){

    var run = function()
    {
      x = event.pageX;
      y = event.pageY;
      Tagger.targeter_x = x;
      Tagger.targeter_y = y;
    };

    // Render the "new page", which is a new tag plus menu
    var render = function(){
      console.log(x);
      console.log(y);
      Tagger.targeter
        .css("left", x)
        .css("top", y)
        .removeClass("hide")
        .addClass("show");

      target_names = $("#target_names");
    };

    run();
    render();
  }

  function createTag(event){
    // catch the tag's coordinates and build a new tag
    var tag_x = Tagger.targeter_x;
    var tag_y = Tagger.targeter_y;
    var name = $(event.target).attr("name");
    var image_name = Tagger.image_name;

    // create the tag locally
    Tagger.container
      .append("<div class='box tag show' name='" +
        name +
        "' style='left:" +
        tag_x + "; top:" +
        tag_y +
        "'>" +
        name +
        "</div>");

    // store the tag locally
    var tag = new Tag(tag_x, tag_y, name, image_name);
    console.log(tag);
    Tagger.tags.push(tag);

    // push the tag into the database


  }

  function showTags(){
    console.log("SHOWING");
    Tagger.container.find(".tag")
      .removeClass("hide")
      .addClass("show");
  }

  function hideTags(){
    console.log("HIDING");
    Tagger.container.find(".tag")
      .removeClass("show")
      .addClass("hide");
  }

  // Construct the targeting box and menu and add the click listeners for it
  function buildTagTargeter(){
    var li = "<li class='name_selector'></li>";
    Tagger.container.append("<div id='tag_targeter' class='hide'></div>");
    Tagger.targeter = $('#tag_targeter');

    Tagger.targeter
      .append("<div id='target_box' class='box'></div>")
      .append("<ul id='target_names'></ul>");

    Tagger.names.forEach(function(name){
      Tagger.targeter.find("#target_names")
        .append("<li class='name_selector' name='" + name + "'>" + name + "</li>");
    });

    // add the cancel button
    Tagger.targeter
      .append("<img class='close' src='/assets/close.png' />");

    // patch on the listeners
    Tagger.targeter.find(".close").click(function(){
      Tagger.targeter.addClass("hide");
    });
    Tagger.targeter.find(".name_selector").click(createTag);
  }

  // Construct the container


  // Returns all our top level functions and variables
  return {
    // variables
    box: box,
    Tag: Tag,
    tags: tags,
    names: names,
    image_name: image_name,
    targeter: targeter,
    container: container,

    // functions etc.
    buildTagTargeter: buildTagTargeter,
    Initializer: Initializer,
    targetTag: targetTag,
    createTage: createTag,
    showTags: showTags,
    hideTags: hideTags,
  };

})();


// RUN SCRIPT (after page load)
$(function() {
  var container = $("#container");

  var initializer = new Tagger.Initializer(container);
  initializer.render();
});