//#pragma strict

@script RequireComponent(AudioSource)

var button1 : GameObject;
var button2 : GameObject;
var button3 : GameObject;
var resultsButton : GameObject;

//Random value ranges
var delaysLowRange : int;					//Set random delay low range
var delaysHighRange : int;					//Set random delay high range
var damageLowRange : int;					//Set random damage low range
var damageHighRange : int;					//Set random damage high range


var buttonChoices = new System.Collections.ArrayList();

var buttons = []; // Initialized in Start() because reasons.

static var gameResources = ["goat", "chicken", "food", "stardust"];

var bombQueue = new System.Collections.ArrayList();

var currentPhase : int;

static var CHOICE_PHASE = 0;
static var RESOLVE_BOMBS_PHASE = 1;

var boom : AudioClip;
var safe : AudioClip;

private var source : AudioSource;

public class Bomb 
{
	var resource : System.String;
	var delay : int;
	var damage : int;
	var bombType: int; // see table above

	// Bomb.bombType table
	static var DEAL_DAMAGE = 0;
	static var HALF_ALL_RESOURCES = 1;
	static var INCREASE_DELAYS = 2;
	static var DECREASE_DELAYS = 3;
	static var INCREASE_DAMAGE = 4;

	function Bomb() 
	{
		randomize();
	}
	
	function randomize() 
	{
		if (Random.value < 0.75)  // Original (Randome.value > 0.75)
		{
			bombType = DEAL_DAMAGE;
		} 
		else 
		{
			switch (Random.Range(0,4))
			{
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
		damage = Random.Range(2, 5);  //Random.Range is weird. This is 2-4.
		resource = bombChoiceManager.gameResources[Random.Range(0, bombChoiceManager.gameResources.Length)];
		delay = Random.Range(2, 7);  //Originally set to (1, 5)
	}

	function ToString() 
	{
		var ret : String;
		switch (bombType) 
		{
			case DEAL_DAMAGE:				
				ret = "Deal " + damage + " to " + resource + " in " + delay + " turns";
				break;
			case HALF_ALL_RESOURCES:
				ret = "Half all the victim's resources in " + delay + " turns";
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
	function ToStringEffect() 
	{
		var ret = "";
		switch (bombType) 
		{
			case DEAL_DAMAGE:
				ret = "You lose " + damage + " " + resource + "(s)";
				break;
			case HALF_ALL_RESOURCES:
				ret = "You lose half of all of your resources"; // + resource + "(s)";
				break;
			default:
				ret = "Invalid bombType in ToStringEffect()!";
				Debug.Log(ret);
				break;
		}
		return ret;
	}
} //End class

function Start () 
{
	buttons = [button1, button2, button3];
	currentPhase = CHOICE_PHASE;
	phaseTransition();
}

function phaseTransition() 
{
	var played = false;
	var explosions = "";
			
	var newBombQueue = new System.Collections.ArrayList();
	resultsButton.GetComponentInChildren(UI.Text).text = "Be Patient!!!  Checking for bombs...";
	switch (currentPhase) 
	{
		case CHOICE_PHASE:
			resultsButton.transform.localScale = Vector3(0,0,0);
			for (var b : GameObject in buttons) 
			{
				b.transform.localScale = Vector3(1,1,1);
				setupButtons();
			}
		break;

		case RESOLVE_BOMBS_PHASE:
			for (var b : GameObject in buttons) 
			{
				b.transform.localScale = Vector3(0,0,0);
			}
			resultsButton.transform.localScale = Vector3(1,1,1);
			
			for (var b : Bomb in bombQueue) 
			{
				if (b.delay <= 0) 
				{	
					audio.PlayOneShot (boom);
					played = true;
					yield WaitForSeconds(2);
					explosions = explosions + b.ToStringEffect() + "\n";
				}
				else
				{
					b.delay--;
					newBombQueue.Add(b);	
				}
			}
			
			bombQueue = newBombQueue;
			
			if (explosions == "") 
			{
				if(!played)
				{
					audio.PlayOneShot (safe);
				}
				yield WaitForSeconds(2);
				explosions = "You're safe this round....";
			}
			resultsButton.GetComponentInChildren(UI.Text).text = explosions;
			break;
		
		default:
			Debug.Log("Invalid phase!!!!");
			break;
	}
}

function setupButtons()
{
	buttonChoices.Clear();
	for (var b : GameObject in buttons) 
	{
		var newChoice = new Bomb();
		buttonChoices.Add(newChoice);
		b.GetComponentInChildren(UI.Text).text = newChoice.ToString();
	}
}

function dumpBombQueue() 
{
	var outString = "";
	for (var bomb in bombQueue) 
	{
		outString = outString + bomb.ToString() + " ";
	}
	
	//Debug.Log(outString);
}

function bombChoiceButton1Pressed() 
{
	addNewBomb(buttonChoices[0]);
	dumpBombQueue();
}

function bombChoiceButton2Pressed() 
{
	addNewBomb(buttonChoices[1]);
	dumpBombQueue();
}

function bombChoiceButton3Pressed() 
{
	addNewBomb(buttonChoices[2]);
	dumpBombQueue();
}

function addNewBomb(b : Bomb) 
{
	if (b.bombType == Bomb.DEAL_DAMAGE || b.bombType == Bomb.HALF_ALL_RESOURCES) 
	{
		bombQueue.Add(b);
	} 
	else if (b.bombType == Bomb.INCREASE_DELAYS || b.bombType == Bomb.DECREASE_DELAYS || b.bombType == Bomb.INCREASE_DAMAGE) 
	{
		print("Bomb increase, decrease and damage");
		for (var otherBomb : Bomb in bombQueue) 
		{
			if (b.bombType == Bomb.INCREASE_DELAYS) 
			{
				print("Increase delay step 1");
				if (otherBomb.resource == b.resource) 
				{
					otherBomb.delay += b.damage;
				}
			}
			else if (b.bombType == Bomb.DECREASE_DELAYS) 
			{
				if (otherBomb.resource == b.resource) 
				{
					otherBomb.delay -= b.damage;
				}
			} 
			else if (b.bombType == Bomb.INCREASE_DAMAGE) 
			{
				if (otherBomb.resource == b.resource) 
				{
					otherBomb.damage += b.damage;
				}
			}
		}
	} 
	else 
	{
		Debug.Log("Invalid bombType!");
	}
	currentPhase = RESOLVE_BOMBS_PHASE;
	phaseTransition();
}


function resultsButtonPressed() 
{
	currentPhase = CHOICE_PHASE;
	phaseTransition();
}

function Update () {

}
