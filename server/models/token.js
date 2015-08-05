'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Selector = new Schema({
    value: String,
    html: String
});

var tokenObject = new Schema({
    value: String, 
    url: String,
    selectors: [Selector]
});


mongoose.model('Token', tokenObject);
