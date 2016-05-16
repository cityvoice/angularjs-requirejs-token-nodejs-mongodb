define(['angular'], function (angular) {
    return {
        name:"rowSelect",
        type:"directive",
        module:function(){
            return {
                link: function( scope, element, attrs ) {
                    element.bind( "click", function() {
                       element.parent().children().removeClass("active"); 
                       element.addClass("active");
                    });
                }
            }   
        }
    }
})