module.exports = (grunt) ->
  
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    htmlmin:
      all:
        options:
          removeComments: true
          collapseWhitespace: true
        files:
          'dist/html/background.html': 'src/html/background.html'
          'dist/html/options.html': 'src/html/options.html'
          'dist/html/popup.html': 'src/html/popup.html'
    cssmin:
      all:
        files:
          'dist/css/bootstrap.min.css': ['src/css/bootstrap.min.css']
          'dist/css/jquery-ui.custom.css': ['src/css/jquery-ui.custom.css']
    uncss:
      dist:
        files:
          'dist/html/options.html': ['src/html/options.html']
          'dist/html/popup.html': ['src/html/popup.html']
    jsvalidate:
      options:
        globals: {}
        esprimaOptions: {}
        verbose: false
      all:
        files:
          src: ['<%=jshint.all%>']
    jshint:
      all: ['src/js/*.js']
    uglify:
      all:
        files:
          'dist/js/background.js': ['src/js/background.js']
          'dist/js/options.js': ['src/js/options.js']
          'dist/js/popup.js': ['src/js/popup.js']
    watch:
      html:
        files: ['src/html/*.html']
        tasks: ['htmlmin']
      css:
        files: ['src/css/*.css']
        tasks: ['cssmin', 'uncss']
      js:
        files: ['src/js/*.js']
        tasks: ['jsvalidate', 'jshint', 'uglify']
    exec:
      rake:
        command: 'rake'

  grunt.loadNpmTasks 'grunt-contrib-htmlmin'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-uncss'
  grunt.loadNpmTasks 'grunt-jsvalidate'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-exec'
  
  grunt.registerTask 'default', 'watch'
  grunt.registerTask 'test', ['jsvalidate', 'jshint']
  grunt.registerTask 'build', ['test', 'htmlmin', 'cssmin', 'uncss', 'uglify', 'exec']
