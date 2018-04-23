var grunt = require("grunt");
grunt.config.init({
    pkg: {
        "name": "webpack helper",
        "version": "1.0.0"
    },
    'create-windows-installer': {
        x64: {
            appDirectory: './packageHelper-win32-x64',
            authors: 'misaka.',
            exe: 'webpackHelper.exe',
            description:"help you setting webpack config",
        }
    }
});

grunt.loadNpmTasks('grunt-electron-installer');
grunt.registerTask('default', ['create-windows-installer']);