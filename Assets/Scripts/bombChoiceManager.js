#pragma strict

var button1 : GameObject;
var button2 : GameObject;
var button3 : GameObject;

var buttons = []; // Initialized in Start() because reasons.

static var gameResources = ["goats", "oxygen", "water", "space dust"];

var bombQueue = [];

var currentPhase : int;

static var CHOICE_PHASE = 0;
static var RESOLVE_BOMBS_PHASE = 1;

public class Bomb {
	public var resource : System.String;
	public var delay : int;
	public var damage : int;
	public var bombType: int; // see table above

	// Bomb.bombType table
	static var DEAL_DAMAGE = 0;
	static var HALF_ALL_RESOURCES = 1;
	static var INCREASE_DELAYS = 2;
	static var DECREASE_DELAYS = 3;
	static var INCREASE_DAMAGE = 4;
	
	function Bomb() {
		randomize();
	};
	
	function randomize() {
		if (Random.value > 0.75) {
			bombType = DEAL_DAMAGE;
		} else {
			switch (Random.Range(0,4)) {
				case 0:
					bombType = HALF_ALL_RESOURCES;
					break;
				case 1:
					bombType = INCREASE_DELAYS;
					break;
				case 2:
					bombType = DECREASE_DELAYS;
					break;
				case 3:
					bombType = INCREASE_DAMAGE;
					break;
			}
		}
		damage = Random.Range(1,4); //Random.Range is weird. This is 1-3 inclusive.
		resource = bombChoiceManager.gameResources[Random.Range(0, bombChoiceManager.gameResources.Length)];
		delay = Random.Range(1,5);
	}

	function ToString() {
		var ret : String;
		switch (bombType) {
			case DEAL_DAMAGE:
				ret = "Deal " + damage + " to " + resource + " in " + delay + " turns";
				break;
			case HALF_ALL_RESOURCES:
				ret = "Half all resources in " + delay + " turns";
				break;
			case INCREASE_DELAYS:
				ret = "Increase all " + resource + " bomb delays by " + damage;
				break;
			case DECREASE_DELAYS:
				ret = "Decrease all " + resource + " bomb delays by " + damage;
			case INCREASE_DAMAGE:
				ret = "Increase all " + resource + " bomb damage levels by " + damage;
				break;
			default:
				Debug.Log("Invalid bombType! this should never happen");
				break;
		}
		return ret;
	}
}

function Start () {
	buttons = [button1, button2, button3];
	currentPhase = CHOICE_PHASE;
	phaseTransition();
}

function phaseTransition() {
	switch (currentPhase) {
		case CHOICE_PHASE:
			// hide the results
			for (var b : GameObject in buttons) {
				b.SetActive(true);
				setupButtons();
			}
			break;
		case RESOLVE_BOMBS_PHASE:
			for (var b : GameObject in buttons) {
				b.SetActive(false);
			}
			// show results
			break;
		default:
			Debug.Log("Invalid phase!!!!");
			break;
	}
}

function setupButtons(){
	var choices = new System.Collections.ArrayList();
	for (var b : GameObject in buttons) {
		var newChoice = new Bomb();
		choices.Add(newChoice);
		b.GetComponentInChildren(UI.Text).text = newChoice.ToString();
	}
}

function Update () {

}