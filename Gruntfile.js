module.exports = function(grunt) {
  var config = {
    watch: {
    }
  };
  config.pkg = grunt.file.readJSON('package.json');
  grunt.initConfig(config);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};