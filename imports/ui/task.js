import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import {checkInputs} from "./body.js"

'./body.js'
 
import './task.html';
import {checkSelected} from "./body";
 
Template.task.events({
	'click .answer .answer-correct .btn'(event) {
		let containerParent = $(event.target).parents(".answer")
		// let correct = $(event.target).parent().hasClass("btn-success")
		let correct = false
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
	'input .answer input':checkNextButton,
	'click':checkNextButton,
	'click .cheat-btn'(){
		let containerParent = $(".answer:visible")
		containerParent.find(".hint-box").toggle()
	}
});

function checkNextButton(event) {
	let containerParent = $(event.target).parents(".answer")
	if(!containerParent[0]){
		return
	}
	let inputs = checkInputs(containerParent)
	console.log(inputs)
	if(inputs){
		$(".next-button").show()
	}else{
		$(".next-button").hide()
	}
	if(checkSelected(containerParent)){
		$(".reasoning").show()
	}else{
		$(".reasoning").hide()
	}
}