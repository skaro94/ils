import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Materialize } from 'meteor/materialize:materialize';
import { $ } from 'meteor/jquery';

import { Contentall } from '../../api/contentall.js';

import { contentRenderHold } from '../launch-screen.js';

import './homepage.html';

// Components used inside the template
import './app-not-found.js';

import '../components/slider.js';
import '../components/mainnews.js';
import '../components/mainparallax.js';
import '../components/panel.js';

Template.homepage.onCreated(function contentShowPageOnCreated() {
});

Template.homepage.onRendered(function contentShowPageOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      contentRenderHold.release();
    }
  });
  $('.slider').slider({
    full_width: false,
    height: 500
  });
  $('.helpmess').parallax();
});

Template.homepage.helpers({
  // We use #each on an array of one item so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes.
  contentArray() {
    const instance = Template.instance();
    const contenttitle = instance.getContentTitle();
    return Contentall.find({});
  },
  ifmobile() {
    if ($(window).width() < 600 ) {
      return true;
    }
    return false;
  },
});

Template.homepage.events({
  'click .insertthis'() {
    FlowRouter.go('contents.add');
  }
});
