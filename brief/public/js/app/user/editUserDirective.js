define(['angular'], function (angular) {
    return {
        name:"editUser",
        type:"directive",
        module:["UserService", function(us){
            return {
                scope:{
                    user:'='
                },
                link: function( scope, element, attrs ) {
                    element.bind( "click", function() {
                        var parent = element.parent().parent();
                        parent.parent().children().removeClass("active");
                        parent.addClass("active");
                        us.edit(scope.user);
                    });
                }
            }
        }]
    }
})