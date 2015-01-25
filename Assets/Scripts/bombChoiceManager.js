#pragma strict

var button1 : GameObject;
var button2 : GameObject;
var button3 : GameObject;
var resultsButton : GameObject;

var buttons = []; // Initialized in Start() because reasons.

static var gameResources = ["goats", "chicken", "food", "stardust"];

var bombQueue = new System.Collections.ArrayList();

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
	
	// Like ToString, but for the victim so we don't print how many turns until it goes off.
	function ToStringEffect() {
		var ret = "";
		switch (bombType) {
			case DEAL_DAMAGE:
				ret = "Lose " + damage + " " + resource + "s";
				break;
			case HALF_ALL_RESOURCES:
				ret = "Lose half your " + resource + "s";
				break;
			default:
				ret = "Invalid bombType in ToStringEffect()!";
				Debug.Log(ret);
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
			resultsButton.transform.localScale = Vector3(0,0,0);
			for (var b : GameObject in buttons) {
				b.transform.localScale = Vector3(1,1,1);
				setupButtons();
			}
			break;
		case RESOLVE_BOMBS_PHASE:
			for (var b : GameObject in buttons) {
				b.transform.localScale = Vector3(0,0,0);
			}
			resultsButton.transform.localScale = Vector3(1,1,1);
			
			var explosions = "";
			
			var newBombQueue = new System.Collections.ArrayList();

			for (var b : Bomb in bombQueue) {
				b.delay--;
				if (b.delay <= 0) {
					explosions = explosions + b.ToStringEffect() + "\n";
				} else {
					newBombQueue.Add(b);
				}
			}
			
			bombQueue = newBombQueue;
			
			if (explosions == "") {
				explosions = "No bombs this turn.";
			}
			resultsButton.GetComponentInChildren(UI.Text).text = explosions;
			break;
		default:
			Debug.Log("Invalid phase!!!!");
			break;
	}
}

var buttonChoices = new System.Collections.ArrayList();

function setupButtons(){
	buttonChoices.Clear();
	for (var b : GameObject in buttons) {
		var newChoice = new Bomb();
		buttonChoices.Add(newChoice);
		b.GetComponentInChildren(UI.Text).text = newChoice.ToString();
	}
}

function dumpBombQueue() {
	var outString = "";
	for (var bomb in bombQueue) {
		outString = outString + bomb.ToString() + " ";
	}
	Debug.Log(outString);
}

function bombChoiceButton1Pressed() {
	addNewBomb(buttonChoices[0]);
	dumpBombQueue();
}

function bombChoiceButton2Pressed() {
	addNewBomb(buttonChoices[1]);
	dumpBombQueue();
}

function bombChoiceButton3Pressed() {
	addNewBomb(buttonChoices[2]);
	dumpBombQueue();
}

function addNewBomb(b : Bomb) {
	if (b.bombType == Bomb.DEAL_DAMAGE || b.bombType == Bomb.HALF_ALL_RESOURCES) {
		bombQueue.Add(b);
	} else if (b.bombType == Bomb.INCREASE_DELAYS || b.bombType == Bomb.DECREASE_DELAYS || b.bombType == Bomb.INCREASE_DAMAGE) {
		for (var otherBomb : Bomb in bombQueue) {
			if (b.bombType == Bomb.INCREASE_DELAYS) {
				if (otherBomb.resource == b.resource) {
					otherBomb.delay += b.damage;
				}
			} else if (b.bombType == Bomb.DECREASE_DELAYS) {
				if (otherBomb.resource == b.resource) {
					otherBomb.delay -= b.damage;
				}
			} else if (b.bombType == Bomb.INCREASE_DAMAGE) {
				if (otherBomb.resource == b.resource) {
					otherBomb.damage += b.damage;
				}
			}
		}
	} else {
		Debug.Log("Invalid bombType!");
	}
	currentPhase = RESOLVE_BOMBS_PHASE;
	phaseTransition();
}

function resultsButtonPressed() {
	currentPhase = CHOICE_PHASE;
	phaseTransition();
}

function Update () {

}