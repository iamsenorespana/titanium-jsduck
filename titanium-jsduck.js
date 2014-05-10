#!/usr/bin/env node
/*
 * Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved
 *
 * This file will setup the initial package for the JSDUCK documentation
 *
 */

var commander = require('commander'),
	fs = require('fs'), 
	os = require('os'),
	wrench = require('wrench'),
	exec = require("child_process").exec,
	browser = "Safari", versionBanner = "",
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
		versionBanner = "Titanium-JSDuck Version " + commander.version();
		console.log( versionBanner );
		
		switch( os.platform() ){
		case 'darwin':
			
			if( fs.existsSync("/usr/bin/jsduck") ){

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
					case 'run':
						runGenerator();
						break;
					default:
						console.log('');
						console.log('[ERROR] Invalid Command entered. Please check the usage again.');
						console.log('');
						runHelp();
						break;
					}			
				}			
			
			} else {
				console.log('');
				console.log('[ERROR] JSDUCK is not installed. This ruby package is required use this node npm package.'.red);
				console.log('[ALERT] Install JSDUCK by running this command: sudo gem install jsduck');
				console.log('');
			}
						
			break;
		default:
			
			console.log('');
			console.log('[WARNING] titanium-jsduck is not currently supported for your current Operating System'.red );
			console.log('');
			
			break;
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
			var messageHelp = "Usage: titanium-jsduck [command] [parameters]\n\n";
			messageHelp += "Commands:\n\tinstall \n\t\t- Installs JSDuck inside a Titanium Mobile Project.";
			messageHelp += "\n\topen \n\t\t- Opens Documentation in Safari Browser";
			messageHelp += "\n\topen firefox \n\t\t- Opens Documentation in Firefox Browser";
			messageHelp += "\n\topen chrome  \n\t\t- Opens Documentation in Google Chrome Browser";
			messageHelp += "\n\trun \n\t\t- Runs jsduck to generate Documentation without compiling Mobile Project";
			
			console.log(messageHelp);
			console.log();
			console.log();
			process.exit();
			
		}
		
		function runGenerator(){
			console.log("[INFO] Running JSDuck Documentation Generator");
			console.log();
			exec("jsduck --config=docs/jsduck.json app");
			process.exit();
		}
		
		function runOpenDocumentation(browserName){
			
			if( fs.existsSync("docs/documentation/index.html") ){

				switch(browserName){
				case 'Chrome':
				case 'chrome':
					if( !fs.existsSync("/Applications/Google\ Chrome.app") ){
						console.log('[WARNING] Cannot find Chrome Application installed, defaulting to Safari Browser'.orange );
						browserName = "Safari";
					} else {
						browserName = "Google\ Chrome";
					}
					break;
				case 'Firefox':
				case 'firefox':
					if( !fs.existsSync("/Applications/Firefox.app") ){
						console.log('[WARNING] Cannot find Firefox Application installed, defaulting to Safari Browser'.orange );
						browserName = "Safari";
					} else {
						browserName = "Firefox";
					}			
					break;
				default: 
					browserName = "Safari";
				break;
				}
				
				var messageSuccess = "[INFO] Opening Project Documentation with the " + browserName + " Browser";
				console.log(messageSuccess);
				console.log();
			
				exec("open -a \"/Applications/" + browserName + ".app\" docs/documentation/index.html");
								
			} else {
				var messageFailure = "[ERROR] Documentation Folder does not exist yet.  Have you compiled your project yet? ";
				console.log(messageFailure.red);
				console.log();				
			}

			process.exit();
		}
		
		function runInstall(){
			// Detect if /app folder exists and/or we are at the root of the Titanium Mobile Project
			if (fs.existsSync("tiapp.xml")) { // or fs.existsSync
			    // 
				paths = getPaths();
				console.log("[INFO] Detected an Titanium Mobile Project" );

			
				if( fs.existsSync("app/alloy.jmk") ){
					// Alloy.jmk exists
					//
					console.log('[INFO] Detected an existing Alloy.jmk... Backing up to alloy.jmk.txt');

					
					// Making a backup of alloy.jmk if already exists
					//fs.createReadStream('app/alloy.jmk').pipe(fs.createWriteStream('app/alloy.jmk.txt'));
					fs.writeFileSync('app/alloy.jmk.txt', fs.readFileSync('app/alloy.jmk'));
					
					// Copy over New Alloy.JMK
					 
					if( fs.existsSync(paths.sourceTemplates + '/alloy.jmk') ){
						//fs.createReadStream(paths.sourceTemplates + '/alloy.jmk').pipe(fs.createWriteStream('app/alloy.jmk'));
						fs.writeFileSync('app/alloy.jmk', fs.readFileSync(paths.sourceTemplates + '/alloy.jmk'));
						console.log('[INFO] Updated alloy.jmk with config for titanium-jsduck');

												 
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
					//fs.createReadStream(paths.sourceTemplates + '/alloy.jmk').pipe(fs.createWriteStream('app/alloy.jmk'));
					fs.writeFileSync('app/alloy.jmk', fs.readFileSync(paths.sourceTemplates + '/alloy.jmk'));
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

