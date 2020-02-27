import { Mongo } from 'meteor/mongo';
 
export const Tasks = new Mongo.Collection('tasks');
export const Translations = new Mongo.Collection('Translations');