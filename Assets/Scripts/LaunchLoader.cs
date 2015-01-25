using UnityEngine;
using System.Collections;

public class LaunchLoader : MonoBehaviour {
	public float seconds = 4.0f;
	public string levelName;

	// Use this for initialization
	void Start () {
		StartCoroutine(delay());
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	IEnumerator delay() 
	{
		  //Debug.Log("Before Waiting 2 seconds");
		  yield return new WaitForSeconds(seconds);
		  //Debug.Log("After Waiting 2 Seconds");
		  Application.LoadLevel(levelName);
		  
	}
}
