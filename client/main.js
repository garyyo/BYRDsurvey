import '../imports/api/jquery.highlight.js'
import '../imports/ui/body.js';
import { Session } from 'meteor/session'
import 'bootstrap/dist/js/bootstrap.bundle';
import { ReactiveVar } from 'meteor/reactive-var'

Session.setDefault("taskStep", Number(0))
Session.setDefault("maxStep", Number(5))
Session.setDefault("additionalSteps", Number(5))
Session.setDefault("ID", makeID(7))
function makeID(length) {
	let result           = '';
	let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


