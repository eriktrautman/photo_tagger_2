var Tagger = (function(){

  // Constants and Globals
  var box = {
    size: 100,
    border: 10
  };
  var image_id = null;
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

  function Tag(x, y, name, image_id, id){
    this.x = x;
    this.y = y;
    this.name = name;
    this.image_id = image_id;
    this.id = id;
    that = this;

    this.save = function(callback){
      $.post("/tags.json", {
        tag: {
          x: this.x,
          y: this.y,
          name: this.name,
          image_id: this.image_id
        }
      }, function(response){
        that.id = response.id;
        console.log("Got back a response! It's: "+response);
        console.log(that);
        if(callback) {
          callback();
        }
      });
    };
  }

  // pull in the tags from the database
  Tag.getTags = function(callback){
    $.getJSON(
      "/tags.json?image_id="+Tagger.image_id,
      function(data){
        data.forEach(function(datum){
          Tagger.tags.push(
            new Tag(
              datum.x,
              datum.y,
              datum.name,
              datum.image_id,
              datum.id
            )
          )
        })
        if(callback){
          callback();
        }
      }
    );
  };

  // turn the tags array into actual tags
  // THIS SHOULDNT LIVE IN THE MODEL SPACE! THIS IS A CONTROLLER ACTION!
  Tag.buildTags = function(){
    console.log("sgusga");
    wrapper = Tagger.container.find(".tags");
    console.log(wrapper);
    console.log(Tagger.tags);
    Tagger.tags.forEach(function(tag){
      console.log("stuff");
      wrapper.append("<div class='box tag show' name='" +
        tag.id +
        "' style='left:" +
        tag.x + "px; top:" +
        tag.y +
        "px'>" +
        tag.name +
        "</div>"
      )
    });
  };

  // The initial setup function
  function Initializer(container){
    Tagger.container = container;
    var image = container.find("img");
    Tagger.image_id = image.attr('name');
    var that = this;
    console.log(Tagger.tags);

    this.render = function(){
      // tag elements
      Tagger.buildTagTargeter(container);
      Tagger.Tag.getTags(Tagger.Tag.buildTags);

      // listeners
      image.click(Tagger.targetTag);
      image.mouseenter(Tagger.showTags);
      image.mouseleave(Tagger.hideTags);
    };
  };

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
    var image_id = Tagger.image_id;

    // create the tag locally
    Tagger.container.find(".tags")
      .append("<div class='box tag show' name='" +
        name +
        "' style='left:" +
        tag_x + "px; top:" +
        tag_y +
        "px'>" +
        name +
        "</div>");

    // store the tag locally
    var tag = new Tag(tag_x, tag_y, name, image_id);
    console.log(tag);
    Tagger.tags.push(tag);

    // push the tag into the database
    tag.save(console.log("SAVED!"));

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
    image_id: image_id,
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