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


  // MODEL *******************************
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
        if(callback) {
          callback(that);
        }
      });
    };

    this.destroy = function(){
      that = this;
      console.log("DESTROYING TAG NOW");
      $.ajax({
        url: '/tags/'+this.id+'.json',
        type: 'DELETE',
        success: function(result){
          $('div[name='+that.id+']').remove();

          // delete the tag from the local array
          index = Tagger.tags.indexOf(that);
          Tagger.tags.splice(index, 1);
        }
      });
    }

    this.freakout = function(){
      console.log("FREAKING OUT");
    }
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
  Tag.renderTags = function(){
    Tagger.tags.forEach(function(tag){
      Tag.renderTag(tag);
    });
  };

  Tag.renderTag = function(tag){
    wrapper = Tagger.container.find(".tags");
    wrapper.append("<div class='box tag show' name='" +
      tag.id +
      "' style='left:" +
      tag.x + "px; top:" +
      tag.y +
      "px'>" +
      tag.name +
      " <img class='tag_close' id='delete_tag_" +
      tag.id +
      "' src='/assets/close.png'/>" +
      "</div>"
    );

    close_button = $('#delete_tag_'+tag.id);
    console.log(close_button);
    close_button.click(tag.destroy.bind(tag));
  }

  // Controller **********************************
  function Initializer(container){  // CALL ME TagsController!!!!
    Tagger.container = container;
    var image = container.find("img");
    Tagger.image_id = image.attr('name');
    var that = this;

    this.render = function(){
      // tag elements
      Tagger.buildTagTargeter(container);
      Tagger.Tag.getTags(Tagger.Tag.renderTags);

      // listeners
      image.click(Tagger.targetTag);
      container.mouseenter(Tagger.showTags);
      container.mouseleave(Tagger.hideTags);
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

    // Render the tag targeter plus menu
    var render = function(){
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

    // store the tag locally
    var tag = new Tag(tag_x, tag_y, name, image_id);
    Tagger.tags.push(tag);

    // push the tag into the database then render it
    tag.save(function(){
      Tag.renderTag(tag);
    });

    // hide the targeter
    Tagger.targeter.removeClass("show").addClass("hide");
  }

  function showTags(){
    Tagger.container.find(".tag")
      .removeClass("hide")
      .addClass("show");
  }

  function hideTags(){
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
    hideTags: hideTags
  };

})();


// RUN SCRIPT (after page load)
$(function() {
  var container = $("#container");

  var initializer = new Tagger.Initializer(container);
  initializer.render();
});


// TO FIX:
// Break up model and controllers
// clean up the returns on the controller... apparently class methods need not apply
// Sort out the namespaces