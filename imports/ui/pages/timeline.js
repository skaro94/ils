import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import { contentRenderHold } from '../launch-screen.js';

import { Timeline } from '../../api/timeline.js';
import { Ip } from '../../api/ip.js';
import { Menus } from '../../api/menus.js';
import { Images } from '../../api/images.js';

import './timeline.html';

// Components used inside the template
import './app-not-found.js';

Template.timeline.onCreated(function timelineOnCreated() {
  this.getId = () => FlowRouter.getParam('id');
  let id = this.getId();
  this.getContentTitle = () => Menus.findOne({_id: id}).name;
  const type = this.getContentTitle();
  Session.set({
    type: type,
    change: false
  });
});

Template.timeline.onRendered(function timelineOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      contentRenderHold.release();
    }
  });
});

Template.addtime.onRendered(function addtimeOnRendered() {
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
        $("input[id='submittime']").click();
  });
});

Template.timeline.helpers({
  type() {
    FlowRouter.watchPathChange();
    const instance = Template.instance();
    return instance.getContentTitle();
  },
  timeline() {
    return Timeline.find({}, {sort: {year: 1}}).fetch();
  },
  ip() {
    const sip = Session.get('ip');
    const dip = sip[0];
    const obj = Ip.findOne({ip: dip});
    return obj ? true : false;
  },
});


Template.mytimeline.helpers({
  image() {
    const instance = Template.instance();
    let afile = instance.data.fileId;
    afile.getFileRecord();
    return afile;
  },
  ip() {
    const sip = Session.get('ip');
    const dip = sip[0];
    const obj = Ip.findOne({ip: dip});
    return obj ? true : false;
  },
});

Template.mytimeline.events({
  'click .red'(event){
    event.preventDefault();
    const id = $(event.currentTarget).attr("name");
    Timeline.remove(id);
  }
});



Template.timeline.events({

});

Template.addtime.events({
  'submit form'(event) {
    event.preventDefault();

    const target = event.target;
    const name = target.name.value;
    const detail = target.detail.value;
    const year = target.year.value;
    const thisfile = target.thisfile.files[0];
    const fileId = Images.insert(thisfile);

    Timeline.insert({
      name: name,
      detail: detail,
      year: year,
      fileId: fileId,
      createdAt: new Date(),
    });

    target.name.value = '';
    target.detail.value = '';
    target.year.value = '';
    $(".dropify-clear").click();
  },
  'click #submittime'(event) {
    event.preventDefault();
    event.stopPropagation();
    $(".timeform").submit();
  },
});
