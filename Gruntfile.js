module.exports = function(grunt) {

  grunt.initConfig({
    shell: {
      startNeo4j: {
        command: 'neo4j-community-2.2.0/bin/neo4j start'
      },
      stopNeo4j: {
        command: 'neo4j-community-2.2.0/bin/neo4j stop'
      },
      restartNeo4j: {
        command: 'neo4j-community-2.2.0/bin/neo4j restart'
      },
      clearDB: {
        command: 'rm -rf neo4j-community-2.2.0/data/graph.db/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');

  // Neo4j
  grunt.registerTask('startneo', ['shell:startNeo4j']);
  grunt.registerTask('stopneo', ['shell:stopNeo4j']);
  grunt.registerTask('restartneo', ['shell:restartNeo4j']);
  grunt.registerTask('clrdb', ['shell:stopNeo4j', 'shell:clearDB', 'shell:startNeo4j']);
};
