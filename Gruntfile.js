module.exports = function(grunt) {

  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    buildpath:'build',
    meta:{
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
           '<%= grunt.template.today("yyyy-mm-dd") %> \n *author:cityvoice[at]hotmail.com\n */\n'
    },
    watch: {
      files: [
        'public/js/**/*.js', 'public/js/**/**/*.js', 'Gruntfile.js'
      ],
      tasks: ['jshint','uglify']
    },
    // sass: {            
    //   dist: {                
    //     files: {                    
    //       'assets/css/styles.css': 'assets/scss/*.scss'                
    //     }            
    //   }        
    // },
    // watch: {
    //   files: ['<%= jshint.files %>', 'assets/scss/**/*.scss'],
    //   tasks: ['concat', 'uglify', 'jshint', 'compass'] 
    // },
    // concat: {
    //     options: {
    //       stripBanners:true,
    //       banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    //       '<%= grunt.template.today("yyyy-mm-dd") %> \n *author:cityvoice[at]hotmail.com\n */\n'
    //     },      
    //     dist: {
    //         // the files to concatenate
    //         src: ['public/js/app/login/login.app.js','public/js/app/login/controllers/*.js','public/js/app/login/services/*.js'],
    //         // the location of the resulting JS file
    //         dest: 'dist/all.js'
    //     }
    // },  
    uglify: {
      // options: {
      //   stripBanners:true,
      //   banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      //   '<%= grunt.template.today("yyyy-mm-dd") %> \n *author:cityvoice[at]hotmail.com\n */\n'
      // },  
      options: {
        banner: '<%= meta.banner %>\n',
        mangle: true
      },   
      build: {
        files: {
          '<%= buildpath %>/js/app/main.min.js': [
            '<banner:meta.banner>', 'public/js/app/main.js'
          ],
          '<%= buildpath %>/js/common/pagetor.min.js': [
            '<banner:meta.banner>', 'public/js/common/pagetor.js'
          ] 
        }
      },
    },      
    // compass: {
    //   dist: {
    //     options: {
    //       sassDir: 'assets/scss',
    //       cssDir: 'assets/css',
    //       environment: 'development',
    //       outputStyle: 'compressed'//nested,expanded,compact
    //     }
    //   }
    // },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'public/js/*.js']
    }
  });

  // 加载Grunt插件
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 注册grunt默认任务
  grunt.registerTask('default', ['watch']);
};