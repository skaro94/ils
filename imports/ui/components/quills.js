import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { Contentall } from '../../api/contentall.js';

var transformer = require('delta-transform-html');

import './quills.html';

Template.quills.onCreated(function quillOnCreated() {
  handle = Meteor.subscribe('contentall');
});

Template.quills.onRendered(function quillOnRendered() {
  var setinit = function() {
    let item = Session.get('item');
    let doc = item.doc;
    let obj = JSON.parse(doc);
    console.log(obj);
    let rendered = transformer.transform(obj);
    console.log(rendered);
    quill.clipboard.dangerouslyPasteHTML(rendered);
  };

  var computation = this.autorun(function(thisComp) {
    const isReady = handle.ready();
    console.log(`Handle is ${isReady ? 'ready' : 'not ready'}`);
    if(isReady) {
      setinit();
      thisComp.stop();
    }
  });
  var Delta = Quill.import('delta');
  Template.quill = quill = new Quill('#editor', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        [{ 'size': ['huge', 'large', 'false', 'small'] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline'],
        ['image'],
        [{ list: 'ordered' }],
        [{ 'align': [] }],

        ['clean']
      ]
    },
    placeholder: '입력하세요',
    theme: 'snow'
  });

  var change = new Delta();
  quill.on('text-change', function(delta) {
    change = change.compose(delta);
  });

  Meteor.setInterval(function() {
    if (change.length() > 0) {
      /*
      Send partial changes
      $.post('/your-endpoint', {
        partial: JSON.stringify(change)
      });*/
      console.log('Saving changes', change);
      const type = Session.get('type');
      console.log("type" + type);
      let item = Session.get('item');
      let contents = quill.getContents();
      let doc = JSON.stringify(contents, null, 2);
      Contentall.update({
        _id: item._id
      },{
        $set: {
          doc: doc,
          createdAt: new Date()
        },
      });
      Session.set({
        doc: doc
      });
      /*Send entire document
      $.post('/your-endpoint', {
        doc: JSON.stringify(quill.getContents())
      });
      */
      change = new Delta();
    }
  }, 5*1000);
});