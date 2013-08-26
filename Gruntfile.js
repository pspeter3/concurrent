module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'index.js', 'lib/*.js', 'test/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};