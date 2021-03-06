import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Materialize } from 'meteor/materialize:materialize';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import { contentRenderHold } from '../launch-screen.js';
import { Ip } from '../../api/ip.js';

import { Menus } from '../../api/menus.js';
import { People } from '../../api/people.js';
import { Images } from '../../api/images.js';
import { PeopleCat } from '../../api/peoplecat.js';
import './peoplepage.html';

// Components used inside the template
import './app-not-found.js';

Template.peoplepage.onCreated(function peopleOnCreated() {
  this.getId = () => FlowRouter.getParam('id');
  let id = this.getId();
  this.getPeopleType = () => Menus.findOne({_id: id}).name;
});

Template.peoplepage.onRendered(function peopleOnRendered() {
});


Template.addpeople.onRendered(function addpeopleOnRendered() {
  $('.dropify').dropify(
    {
      messages: {
          'default': '파일을 드래그하거나 클릭하세요.',
          'replace': '파일을 바꾸려면 파일을 드래그하거나 클릭하세요.',
          'remove':  '지우기',
          'error':   '파일 형식 오류'
      }
  }
  );
  $("input[type='image']").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("input[id='submitpeople']").click();
  });
});


Template.peoplepage.helpers({
  // We use #each on an array of one item so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes.
  type() {
    FlowRouter.watchPathChange();
    const instance = Template.instance();
    return viewtype = instance.getPeopleType();
  },
  people() {
    return People.find({}).fetch();
  },
  peoplesearch() {
    const ses = Session.get("searched");
    if ( ses != null ) {
      return ses;
    } else {
      return People.find({});
    }
  },
  searchednot() {
    const ses = Session.get("keyword");
    if ( ses == null || ses=="" ) {
      return true;
    } else {
      return false;
    }
  },
  ip() {
    const sip = Session.get('ip');
    const dip = sip[0];
    const obj = Ip.findOne({ip: dip});
    return obj ? true : false;
  },
});

Template.peoplecard.helpers({
  id() {
    const instance = Template.instance();
    const id = instance.data._id;
    return "secret/" + id;
  },
  ip() {
    const sip = Session.get('ip');
    const dip = sip[0];
    const obj = Ip.findOne({ip: dip});
    return obj ? true : false;
  },
  ifimage() {
    const instance = Template.instance();
    let afile = instance.data.fileId;
    if (afile) {
      return true;
    } else {
      return false;
    }
  },
  image() {
    const instance = Template.instance();
    let afile = instance.data.fileId;
    afile.getFileRecord();
    return afile;
  },
});

Template.peoplecat.helpers({
  cat() {
    let cat = PeopleCat.find({}, { sort: { priority: -1 }}).fetch();
    let result = [];
    for (let i = 0; i < cat.length; i++) {
      let objecty = {};
      objecty.name = cat[i].name;
      console.log("WTF", cat[i]);
      const datum = People.find({department: objecty.name}).fetch();
      objecty.datum = datum;
      result.push(objecty);
    }
    return result;
  },
});

Template.peopleeach.helpers({
  people() {
    const instance = Template.instance();
    const ous = instance.data.datum;
    return ous;
  },
});

Template.peoplecard.events({
  'click .mainpeo'(e) {
    e.preventDefault();
    const instance = Template.instance();
    const id = instance.data._id;
    const target = $("#"+id);
    if ( !target.hasClass("active") ) {
      $(".active1").removeClass( "s12 m12 l8 active1" ).addClass( "s12 m6 l4" );
      $(".activecard1").removeClass("large activecard1").addClass("medium");

      $("#"+id).removeClass( "s12 m6 l4" ).addClass( "s12 m12 l8 active1" );
      $(id).removeClass("medium").addClass("large activecard1");
      $("#" + id + " .ishidden").show();
    }
  },
  'click .noclick'(e) {
    e.stopPropagation();
  },
  'click .red'(event) {
    event.preventDefault();
    const id = $(event.currentTarget).attr("name");
    People.remove(id);
  }
});

Template.peoplepage.events({
  'click .gallerywrapper'(e) {
    $(".active1 .ishidden").hide();
    $(".active1").removeClass( "s12 m12 l8 active1" ).addClass( "s12 m6 l4" );
    $(".activecard1").removeClass("large activecard1").addClass("medium");
  },
});

Template.addpeople.events({
  'submit form'(event) {
    event.preventDefault();

    const target = event.target;
    const name = target.name.value;
    const journals = target.journals.value;
    const jobs = target.jobs.value;
    const detail = target.detail.value;
    const depart = target.department.value;
    const thisfile = target.thisfile.files[0];
    let fileId = null;
    if (thisfile) {
      fileId = Images.insert(thisfile);
    }

    People.insert({
      name: name,
      detail: detail,
      job: jobs,
      journal: journals,
      department: depart,
      fileId: fileId,
      createdAt: new Date(), // current time
    });
    Session.set({name: name});
    target.name.value = '';
    target.detail.value = '';
    target.journals.value = '';
    target.jobs.value = '';
    target.department.value = '';
    $(".dropify-clear").click();
  },
  'click #submitpeople'(event) {
    event.preventDefault();
    event.stopPropagation();
    $(".peopleform").submit();
  },
});
