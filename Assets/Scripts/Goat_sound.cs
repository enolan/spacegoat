using UnityEngine;
using System.Collections;

public class Goat_sound : MonoBehaviour 
{

    public AudioClip goatSound;

	// Use this for initialization
	void Start () 
    {
	
	}
	
	// Update is called once per frame
	void Update () 
    {
	
	}



    void Awake()
    {
        audio.PlayOneShot(goatSound);
    }

}
