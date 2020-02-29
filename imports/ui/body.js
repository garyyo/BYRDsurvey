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
let submitted = new ReactiveVar(false)

export const updateView = function(){
	$(".answer").hide()
	$(".answer:nth-child(" + (Session.get("taskStep")+1) +")").show()

	$(".next-button").hide()
	$(".reasoning").hide()
}
export const hideView = function(){
	$(".answer").hide()
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
		let translations = Translations.find({}).fetch()
		for (i in translations) {
			// console.log(i, translations[i])
			let t = translations[i]
			if (Math.random() < .5) {
				t.isCorrect = true;
			}else{
				t.isCorrect = false;
			}
		}
		
		let data = SeededShuffle.shuffle(translations, Session.get("ID"))
		// console.log(data)
		return data
	},
	startScreen() {
		return startScreen.get()
	},
	endScreen() {
		if (endScreen.get()){
			hideView()
		} else {
			updateView()
		}
		return endScreen.get()
	},
	submitted() {
		return submitted.get()
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
		console.log("its fine, im here")
		let translations = Translations.find({}).fetch()
		let translation_keys = translations.map(function(currentValue){return currentValue._id._str})
		// console.log(translation_keys)
		// Prevent default browser form submit
		event.preventDefault();
	 
		// Get value from form element
		const target = event.target;

		let answers = {}
		for(let i in translation_keys){
			let key = translation_keys[i]
			let table = $(target).find("#"+key)
			if (table.attr("complete") !== "true") {
				continue;
			}
			
			let selectedTextPIE = table.find(".PIE-hidden-selected").val()
			let selectedTextGermanic = table.find(".Germ-hidden-selected").val()
			let selected_correct = table.find(".change-correct").val() === "true"
			let actually_correct = table.attr("isCorrect")
			if(actually_correct === undefined) {
				actually_correct = false
			}else{
				actually_correct = true
			}
			let reasoning = table.find(".reasoning").val();
			
			// console.log(translations[i])

			answers[key] = {
				id: Session.get("ID"),
				selectedTextPIE,
				selectedTextGermanic,
				selected_correct,
				actually_correct,
				reasoning,
				PIE: translations[i].PIE,
				wrong: translations[i].wrong,
				right: translations[i].right,
				
			}
			
		}
		console.log(answers)
		// Insert a task into the collection
		Tasks.insert(answers);
	},
	'click .next-button'(event) {
		$($(".answer:nth-child(" + (Session.get("taskStep")+1) +")")[0]).attr("complete", "true")
		Session.set("taskStep", Session.get("taskStep")+1)
		if(Session.get("taskStep") >= Session.get("maxStep")) {
			endScreen.set(true);
		}
		
		updateView()
	},
	'click .start-button'(event) {
		startScreen.set(false)
	},
	'click .more-button'(event) {
		endScreen.set(false)
		let maxStep = Session.get("maxStep")
		Session.set("maxStep", maxStep+Session.get("additionalSteps"))
	},
	'click .end-button'(event) {
		submitted.set(true)
		$(".translation").submit()
	},
	'click'(event) {
		// console.log("taskStep: " + Session.get("taskStep"))
		// console.log("maxStep: " + Session.get("maxStep"))
		// console.log("ID: " + Session.get("ID"))
		// console.log("startScreen: " + startScreen.get())
		// console.log("endScreen: " + endScreen.get())
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
