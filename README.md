# template.phonegap.gulp.browserify.react.backbone
Boilerplate template for PhoneGap applications

# Installation

• Clone this repository

• Install the tools

run: 'npm' in terminal within root of project folder and if not found then install Node.js and npm

• Install the required npm dependencies

run: sudo npm install -g gulp@3.6.2<br/>
run: sudo npm install -g cordova<br/>
run: sudo npm install -g phonegap

• Install the iOS simulator

run: sudo npm install ios-sim -g<br/>
run: sudo npm install ios-deploy -g

• Install local Node dependencies

run: npm install

• Add the iOS and Android platforms to Cordova

run: cordova platform add ios<br/>
run: cordova platform add android

Note: If you have troubles doing so, it may be because Git did not create the platforms, .cordova or plugins folder. You should also run gulp at least once or create the phonegap www folder manually.

• Running the project on iOS simulator

run: gulp<br/>
run: cordova build ios<br/>
run: cordova emulate ios

Note: If you experience issues, make sure you enable developer mode on your machine. Run: DevToolsSecurity -enable Note: If you cannot get the emulator to run open the iOS application /platforms/ios/[project-name] with XCode and then build/emulate from within XCode

• Running the project on Ripple emulator

run: gulp<br/>
run: ripple emulate
