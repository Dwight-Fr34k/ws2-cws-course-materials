/*
 * Generic scripts
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */


String.prototype.beginsWith = function(t) {
    'use strict';
    t = t.toString();
    return (t.toString() === this.substring(0, t.length));
};

String.prototype.trim = function() {
    'use strict';
    return this.replace(/^\s+/,'').replace(/\s+$/,'');
};

String.prototype.getParameter = function(t) {
    'use strict';
    t = t.toString();
    var pairs = this.split('&');
    for (var i = 0; i < pairs.length; i++) {
        var keyValue = pairs[i].split('=');
        if (decodeURI(keyValue[0]) === t) {
            return decodeURI(keyValue[1]);
        }
    }
    return undefined;
};
