import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title  : window.document.title;
    window.document.title = title;
};

const ajaxUrl = env === '{baseUrl}' ;

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

export default util;