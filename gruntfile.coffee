module.exports = (grunt) ->
  
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    jsvalidate:
      options:
        globals: {}
        esprimaOptions: {}
        verbose: false
      all:
        files:
          src: ['<%=jshint.all%>']
    jshint:
      all: ['./src/js/*.js']
    watch:
      js:
        files: ['./src/js/*.js']
        tasks: ['jsvalidate', 'jshint']
    exec:
      rake:
        command: 'rake'

  grunt.loadNpmTasks 'grunt-jsvalidate'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-exec'
  
  grunt.registerTask 'default', 'watch'
  grunt.registerTask 'test', ['jsvalidate', 'jshint']
  grunt.registerTask 'build', ['test', 'exec:rake']
