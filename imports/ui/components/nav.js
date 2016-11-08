import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { Contentall } from '../../api/contentall.js';
import { Menus } from '../../api/menus.js';

import './nav.html';


Template.nav.onCreated(function navOnCreated() {
});

Template.nav.onRendered(function navOnRendered() {
});

Template.myNav.onRendered(function() {
  $(".button-collapse").sideNav();
});

Template.dropdownbt.onRendered(function() {
  $(".dropdown-button").dropdown({hover: true});
});

Template.collapsiblemobile.onRendered(function() {
  $(".collapsible").collapsible();
});

Template.nav.helpers({
  // We use #each on an array of one item so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes.
  contentArray() {
    return Contentall.find({});
  },
});

Template.myNav.menus = function(parent) {
  if (parent) {
    return Menus.find({parent:parent}).fetch();
  } else {
    return Menus.find({parent:null});
  }
}

Template.dropdownit.menus = function(parent) {
  if (parent) {
    return Menus.find({parent:parent}).fetch();
  } else {
    return Menus.find({parent:null});
  }
}

Template.collapsiblemobile.menus = function(parent) {
  if (parent) {
    return Menus.find({parent:parent}).fetch();
  } else {
    return Menus.find({parent:null});
  }
}

Template.dropdownli.events({
  'click .tolink'() {
    console.log("clicked!");
    const instance = Template.instance();
    const contenttitle = instance.data.name;
    const menutype = instance.data.type;
    console.log(contenttitle);
    if ( menutype == "board" ) {
      FlowRouter.go('bulletins.show', { titleinput: contenttitle });
    } else if ( menutype == "gallery" ) {
      FlowRouter.go('bulletins.show', { titleinput: contenttitle });
    } else if ( menutype == "people" ) {
      FlowRouter.go('bulletins.show', { titleinput: contenttitle });
    } else if ( menutype == "site" ) {
      FlowRouter.go('bulletins.show', { titleinput: contenttitle });
    } else {
      FlowRouter.go('contents.show', { titleinput: contenttitle });
    }
  }
});