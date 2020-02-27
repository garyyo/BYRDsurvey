import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import {checkInputs} from "./body.js"

'./body.js'
 
import './task.html';
 
Template.task.events({
	'click .toggle-checked'() {
		// Set the checked property to the opposite of its current value
		Tasks.update(this._id, {
			$set: { checked: ! this.checked },
		});
	},
	'click .delete'() {
		Tasks.remove(this._id);
	},
	'click .answer .answer-correct .btn'(event) {
		let containerParent = $(event.target).parents(".answer")
		let correct = $(event.target).hasClass("btn-success")
		$(containerParent).find(".change-correct").val(correct)
		$(containerParent).find(".change-correct").trigger("input")
		// if it is correct
		if(correct){
			// make sure that the text box and highlight instructions are hidden.
			$(containerParent).find(".reasoning").hide()
			// todo: clear any text selection. this might not be a problem

			// show the next button

		}else{
			// make sure that the text box and highlight instructions are shown.
			$(containerParent).find(".reasoning").show()

			// show the next button

		}

	},
	'input .answer input'(event) {
		let containerParent = $(event.target).parents(".answer")
		if(checkInputs(containerParent)){
			$(".next-button").show()
		}else{
			$(".next-button").hide()
		}
	}
});