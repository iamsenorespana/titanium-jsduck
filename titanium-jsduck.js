#!/usr/bin/env node
/*
 * Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved
 *
 * This file will setup the initial package for the JSDUCK documentation
 *
 */

var commander = require('commander'),
	fs = require('fs'), 
	wrench = require('wrench'),
	exec = require("child_process").exec,
	browser = "Safari",
	path = require('path'), paths = null;
	
	require('colors');

	commander
		.version(require('./package.json').version)
        .description('titanium-jsduck command line')
        .usage('titanium-jsduck COMMAND');
	
		commander.command('install'.blue+' <dir>'.white).description('    create a JSDUCK documentation instance in Titanium Mobile Project'.grey);
		commander.command('open'.blue+' [dir]'.white).description('    open the documentation in browser'.grey);
		commander.parse(process.argv);
		
		//Opening Banner
		console.log('');
		console.log('Titanium-JSDuck Version ' + commander.version() + ''.white );
		console.log('');
		

		// Detecting if any commands + arguments where passed
		if( commander.args.length === 0 ){
			runHelp();
		} else {
			switch(commander.args[0]){
			case 'install':
				runInstall();
				break;
			case 'open':
				 
				if( commander.args[1] ){
					browser = commander.args[1];
				}
				runOpenDocumentation(browser);
				break;
			default:
				console.log('');
				console.log('Invalid Command');
				console.log('');
				break;
			}			
		}
		
		
		
		
		//
		// HELPER METHODS
		//
		function getPaths(){
			var tempPaths = {
				sourceDir: path.join(__dirname)
			}
			
			tempPaths["sourceTemplates"] = path.join(tempPaths.sourceDir,'templates');
			tempPaths["docTemplates"]    = path.join(tempPaths.sourceDir,'templates','docs');
			tempPaths["cwd"]			 = path.join(process.cwd());
			tempPaths["targetDirectory"] = path.join('.');
			tempPaths["targetDocPath"]	 = path.join(tempPaths.cwd,'docs');
			return tempPaths;
			
		};
		
		function copyFile(){
			fs.createReadStream(paths.sourceTemplates + '/alloy.jmk').pipe(fs.createWriteStream('app/alloy.jmk'));
		};
		
		//
		// Main Command Methods
		// 
		function runHelp(){
			
			console.log('help Information');
			process.exit();
			
		}
		
		function runOpenDocumentation(browserName){
			
			switch(browserName){
			case 'Chrome':
			case 'chrome':
				if( !fs.existsSync("/Applications/Google\ Chrome.app") ){
					console.log('[WARNING] Cannot find Chrome Application installed, defaulting to Safari Browser'.orange );
					console.log('');
					browserName = "Safari";
				} else {
					browserName = "Google\ Chrome";
				}
				break;
			case 'Firefox':
			case 'firefox':
				if( !fs.existsSync("/Applications/Firefox.app") ){
					console.log('[WARNING] Cannot find Firefox Application installed, defaulting to Safari Browser'.orange );
					console.log('');
					browserName = "Safari";
				}				
				break;
			default: 
				browserName = "Safari";
			break;
			}
			
			console.log('[LOG] Opening Project Documentation with the ' + browserName + ' Browser'.white );
			console.log();
			
			exec("open -a \"/Applications/" + browserName + ".app\" docs/generatedDocumentation/index.html");
			process.exit();
		}
		
		function runInstall(){
			// Detect if /app folder exists and/or we are at the root of the Titanium Mobile Project
			if (fs.existsSync("tiapp.xml")) { // or fs.existsSync
			    // 
				paths = getPaths();
				console.log("[LOG] Detected an Titanium Mobile Project".white );
				console.log('');
			
				if( fs.existsSync("app/alloy.jmk") ){
					// Alloy.jmk exists
					//
					console.log('[LOG] Detected an existing Alloy.jmk... Backing up to alloy.jmk.txt'.white);
					console.log('');
					
					// Making a backup of alloy.jmk if already exists
					fs.createReadStream('app/alloy.jmk').pipe(fs.createWriteStream('app/alloy.jmk.txt'));
					
					// Copy over New Alloy.JMK
					 
					if( fs.existsSync(paths.sourceTemplates + '/alloy.jmk') ){
						fs.createReadStream(paths.sourceTemplates + '/alloy.jmk').pipe(fs.createWriteStream('app/alloy.jmk'));
						console.log('[LOG] Updated alloy.jmk with config for titanium-jsduck'.white);
						console.log('');
												 
	                     var docPath = path.join(paths.targetDirectory,'docs');
	                     wrench.mkdirSyncRecursive(docPath, 0755);
	                     wrench.copyDirSyncRecursive(paths.docTemplates,paths.targetDocPath,{preserve:true,forceDelete:true});	
						 
						 					
					} else {
						console.log('[ERROR] cannot find alloy.jmk in templates '.red );
					}

				
				} else {
					// Alloy.jmk does not exists
					console.log("Cannot find an alloy.jmk file in your project.");
					console.log("Generating a customized alloy.jmk for you with titanium-jsduck configured to run. ");
					//console.log("Please wait.... ");
					
					console.log('');
					fs.createReadStream(paths.sourceTemplates + '/alloy.jmk').pipe(fs.createWriteStream('app/alloy.jmk'));

                    var docPath = path.join(paths.targetDirectory,'docs');
                    wrench.mkdirSyncRecursive(docPath, 0755);
                    wrench.copyDirSyncRecursive(paths.docTemplates,paths.targetDocPath,{preserve:true,forceDelete:true});	
									
					process.exit();					
				}
			
			
			
			} else {
				// App does not exists
			    // 
				console.log("Cannot detect if an App folder exists. ");
				console.log("Are you sure you are in the root of Titanium Mobile Project? ");
				console.log('');
			
				process.exit();		
			}			
		}

