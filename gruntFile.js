module.exports = function(grunt){

	// Project configuration.
  grunt.initConfig({
  uglify: {
    spotaplace: {
      files: [{
          expand: true,
          cwd: '/js',
          src: '**/*.js',
          dest: 'dest/js'
      }]
    }
  }
});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
}
