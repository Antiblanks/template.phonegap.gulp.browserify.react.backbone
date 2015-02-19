# template.phonegap.gulp.browserify.react.backbone
Boilerplate template for PhoneGap applications

# Installation

• Duplicate the boilerplate

Clone the repos

• Install the tools

run: 'npm install' in terminal within root of project folder and if not found then install Node.js and npm

• Install the required npm dependencies

run: sudo npm install -g gulp@3.6.2
run: sudo npm install -g cordova
run: sudo npm install -g phonegap

• Install the iOS simulator

run: sudo npm install ios-sim -g
run: sudo npm install ios-deploy -g

• Install local Node dependencies

run: npm install

• Add the iOS platform to Cordova

run: cordova platform add ios

Note: If you have troubles doing so, it may be because Git did not create the platforms, .cordova or plugins folder. You should also run gulp at least once or create the phonegap www folder manually.

• Run the project on iOS simulator

run: gulp
run: cordova build ios
run: cordova emulate ios

Note: If you experience issues, make sure you enable developer mode on your machine. Run: DevToolsSecurity -enable Note: If you cannot get the emulator to run open the iOS application /platforms/ios/[project-name] with XCode and then build/emulate from within XCode
