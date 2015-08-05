(function(){
    JSInject = {};
    JSInject.currentSelector = '';
    
    JSInject.webAPI = "http://localhost:3000";
    JSInject.token = "1234567890";
    JSInject.injectList = [];
    
    (JSInject.get = function(){
        $.getJSON(JSInject.webAPI + "/get/" + JSInject.token)
            .done(function(data){
                JSInject.injectList = data;
                JSInject.inject();
            })
            .fail(function(error){
                
            });
    })();
    
    JSInject.insert = function(){
        $.post(JSInject.webAPI + "/save", 
               {
                    url:location.href,
                    value:JSInject.token, 
                    html:JSInject.htmlInject.val(), 
                    selector: JSInject.currentSelector
                }
            )
            .done(function(data){
                JSInject.dialogInject.dialog( 'close' );
                location.reload();
            })
            .fail(function(error){
                
            });
    };
    
    
    
    JSInject.inject = function(){
        if(JSInject.injectList && JSInject.injectList.length > 0){
            $.each(JSInject.injectList, function(index, doc){
                $(doc.value).append(doc.html);
            });
        }   
        
    };
    
    JSInject.query = function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    
})();



$(function() {
    
    //Include JqueryUI
    $('<script lang="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>').appendTo($('body'));
    $('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.css">').appendTo($('head'));
    $('<script lang="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>').appendTo($('body'));
    
    
    JSInject.imageInject = $('<div></div>')
                            .addClass("imageInject")
                            .appendTo($('body'))
                            .hide();
    
    JSInject.htmlInject = $('<textarea id="JSInjectDialogText" cols="40" rows="5"></textarea>');
    JSInject.dialogInject = $('<div id="JSInjectDialog"></div>')
                        .append(JSInject.htmlInject)
                        .appendTo($('body'))
                        .hide();
    
    
    setTimeout(function(){
        JSInject.dialogInject.dialog({
                              autoOpen: false,
                              height: 300,
                              width: 450,
                              modal: true,
                              buttons: {
                                "Inserisci": JSInject.insert,
                                Cancel: function() {
                                  JSInject.dialogInject.dialog( 'close' );
                                }
                              },
                              close: function() {
                                
                              }
                        });
    },1000);
    
    
    JSInject.imageInject.on("click", function(event){
        
        JSInject.dialogInject.dialog( 'option', 'title', JSInject.currentSelector );
        JSInject.dialogInject.dialog('open');
        
        var currentSelector = _.find(JSInject.injectList, {value:JSInject.currentSelector});
        if(currentSelector){
            JSInject.htmlInject.val(currentSelector.html);
        }
        else{
            JSInject.htmlInject.val('');
        }
        
        event.stopPropagation();
    });
    
    if(JSInject.query('JSInject') && JSInject.query('JSInject') === 'true'){
        $('*')
        .not('html, head, link, body, script, div#JSInjectDialog, div#JSInjectDialog *, div.imageInject, div.ui-dialog, div.ui-dialog *, div.ui-widget-overlay')
        .on("click", function() {
            var selector = $(this)
                .parents()
                .map(function() { return this.tagName; })
                .get()
                .reverse()
                .concat([this.nodeName])
                .join(">"), 
                currentElement,
                bodyWidth = $('body').width(),
                left = 0,
                top = 0;

            var id = $(this).attr("id");
            if (id) { 
              selector += "#"+ id;
            }

            var classNames = $(this).attr("class");
            if (classNames) {
              selector += "." + $.trim(classNames).replace(/\s/gi, ".");
            }

            JSInject.currentSelector = selector;
            currentElement = $(JSInject.currentSelector);
            left = currentElement.position().left + currentElement.width() + 20;
            top = currentElement.position().top + currentElement.outerHeight();

            if(left + 20 > bodyWidth)
                left = bodyWidth - 20;

            var offset = {
                top: top,
                left: left
            };

            JSInject.imageInject.show();
            JSInject.imageInject.offset(offset);

            return false;
        });
    }
});