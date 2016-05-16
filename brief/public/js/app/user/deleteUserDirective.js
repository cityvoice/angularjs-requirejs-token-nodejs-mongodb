define(['angular'], function (angular) {
    return {
        name:"deleteUser",
        type:"directive",
        module:["UserService", function(us){
            return {
                scope:{
                    user:'='
                },
                link: function( scope, element, attrs ) {
                    element.bind( "click", function() {
                        us.deleteUser(scope.user);
                        element.parent().parent().remove();
                    });
                }
            }
        }]
    }
})
