'use strict';

var mongoose = require('mongoose'),
    Token = mongoose.model('Token'),
    _ = require('lodash');


exports.save = function(source, callback){
    Token.findOne({value:source.value}, function(error, doc){
        if(!doc){
            doc = new Token();
            doc.value = source.value;
            doc.url = source.url;
        }
        
        var justSelector = _.find(doc.selectors, {'value':source.selector});
        
        if(!justSelector){        
            doc.selectors.push({
                value: source.selector,
                html: source.html
            });
        }
        else{
            justSelector.html = source.html;
        }
                
        doc.save(function(err) {
            if (err) {
                callback(null);
            } else {
                callback(doc);
            }
        });     
    });
};


exports.get = function(token, callback){
    Token.findOne({value:token}, function(error, doc){
        if(error){
            callback(null);
        }
        
        if(doc){
            callback(doc.selectors);
        }
    });
};