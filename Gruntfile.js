module.exports = function(grunt) {
  var projectConfig = {
    watch: {
    }
  };
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: projectConfig.watch
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};