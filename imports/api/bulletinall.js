import { Mongo } from 'meteor/mongo';
import { Counts } from 'meteor/tmeasday:publish-counts';

export const Bulletinall = new Mongo.Collection('bulletinall');

if (Meteor.isServer) {

}
