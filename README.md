titanium-jsduck
===============

NPM Package for initializing JSDuck Documentation for Appcelerator Titanium Mobile Application Projects

#### Description
Documentation of your software projects is a critical phase of the software delivery process.  This package allows you to include JSDuck commenting in your .js files of an Alloy Project.  Everytime the project is compiled, your documentation will be updated.  

The project includes two commands currently.  The first is to automate the installation of the post:compile hook and source files for the documentation.  The second command allows a quick method to preview the documentation within a web browser.

#### Installing the NPM package

Launch Terminal and run the following command:

	npm install titanium-jsduck -g
	

#### Activating Documentation

In order to use this NPM package, you must first be in the root of your Titanium Mobile Project. Either open a terminal window or use the Terminal inside Titanium Studio and run the following command:


	titanium-jsduck install
	
This will install the following items in your Titanium Mobile Project:

* a docs/ folder in the root of your project
* alloy.jmk inside your app/ folder

If an alloy.jmk already exists, it will back it up to be alloy.jmk.txt and install a fresh alloy.jmk with the post:compile command to run.

