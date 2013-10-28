module.exports = (grunt) ->
  
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    jshint:
      all: ['./src/js/*']
    watch:
      js:
        files: ['./src/js/*']
        tasks: ['jshint']
  
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  
  grunt.registerTask 'default', 'watch'