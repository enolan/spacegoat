using UnityEngine;
using System.Collections;

public class MenuEvents : MonoBehaviour 
{

	// Use this for initialization
	void Start () 
    {
	
	}
	
	// Update is called once per frame
	void Update () 
    {
	    
	}

    public void exitApplication()
    {
		Debug.Log("exitApplication()");
		Application.Quit();
    }

    public void loadLevel(string levelName)
    {
        Application.LoadLevel(levelName);
    }

   
}
