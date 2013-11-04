module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
    }
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};