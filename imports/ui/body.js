import {Template} from 'meteor/templating';
import {Tasks} from '../api/tasks.js';
import {Translations} from '../api/tasks.js';
import {Session} from 'meteor/session'
import {ReactiveVar} from "meteor/reactive-var"
import SeededShuffle from 'seededshuffle'

import './task.js';
import './body.html';

let startScreen = new ReactiveVar(true)
let endScreen = new ReactiveVar(false)

export const updateView = function(){
	$(".answer").hide()
	$(".answer:nth-child(" + (Session.get("taskStep")+1) +")").show()

	$(".next-button").hide()
	$(".reasoning").hide()
}
export const checkInputs = function(parent){
	let selectedPIE = Boolean($(parent).find(".PIE-hidden-selected").val())
	let selectedGerm = Boolean($(parent).find(".Germ-hidden-selected").val())
	let selectedCorrect = Boolean($(parent).find(".change-correct").val())
	let correctVal = $(parent).find(".change-correct").val() === "true"
	let typedReasoning = Boolean($(parent).find(".reasoning-form").val())

	return (selectedCorrect && correctVal) || (!correctVal && selectedPIE && selectedGerm && selectedCorrect && typedReasoning)
}

Template.body.helpers({
	tasks() {
		let data = SeededShuffle.shuffle(Translations.find({}).fetch(), Session.get("ID"))
		return data
	},
	startScreen() {
		return startScreen.get()
	},
	endScreen() {
		return endScreen.get()
	}
});

Template.task.onRendered(function (){
	this.$('.selectable').mouseup(CurrentSelection.Selector.mouseup);
	this.$("input").keydown(function(event){
		if(event.keyCode === 13) {
			event.preventDefault();
			return false;
		}
	});
	updateView()
});

Template.body.events({
	'submit .translation'(event) {
		let translation_keys = Translations.find({}).fetch().map(function(currentValue){return currentValue._id._str})
		console.log(translation_keys)
		// Prevent default browser form submit
		event.preventDefault();
	 
		// Get value from form element
		const target = event.target;

		let answers = {}
		for(let i in translation_keys){
			let key = translation_keys[i]
			let table = $(target).find("#"+key)
			
			let selectedTextPIE = table.find(".PIE-hidden-selected").val()
			let selectedTextGermanic = table.find(".Germ-hidden-selected").val()
			let translation_correct = table.find(".checkbox").is(":checked")
			let reasoning = table.find(".reasoning").val();
			
			answers[key] = {
				id: Session.get("ID"),
				selectedTextPIE,
				selectedTextGermanic,
				translation_correct,
				reasoning
			}
			
		}
		
		// Insert a task into the collection
		// Tasks.insert(answers);
	},
	'click .next-button'(event) {
		console.log("ya clicked it")
		let stepNum = Session.get("taskStep")
		let maxStep = Session.get("maxStep")
		Session.set("taskStep", stepNum+1)
		if(stepNum > maxStep) {
			endScreen.set(true);
		}
		
		updateView()
	},
	'click .start-button'(event) {
		startScreen.set(false)
		console.log("start screen: " + startScreen.get())
	}
});

let CurrentSelection = {}

// Selector object
CurrentSelection.Selector = {}

// get the current selection
CurrentSelection.Selector.getSelected = function(){
	let sel = '';
	if(window.getSelection){
		sel = window.getSelection()
	}
	else if(document.getSelection){
		sel = document.getSelection()
	}
	else if(document.selection){
		sel = document.selection.createRange()
	}
	return sel
}

// function to be called on mouseup
CurrentSelection.Selector.mouseup = function(event){
	let selectedText = CurrentSelection.Selector.getSelected().toString()
	let containerParent = $(event.target).parents(".answer")
	$(this).unhighlight()
	$(this).highlight(selectedText)
	$(this).find(".PIE-hidden-selected").val(selectedText)
	$(this).find(".Germ-hidden-selected").val(selectedText)
	$(containerParent).find(".change-correct").trigger("input")
}
