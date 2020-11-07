const fs = require('fs')
const fse = require('fs-extra')
const childProcess = require('child_process')

if (fs.existsSync('./build')) {
  fse.removeSync('./build')
}

// fse.copySync('./server', './production', { overwrite: true })

// Run 'react-scripts build' script
childProcess.execSync('react-scripts build', { stdio: 'inherit' })

// Move app build to server/build directory
fse.moveSync('./build', './server/build', { overwrite: true })

