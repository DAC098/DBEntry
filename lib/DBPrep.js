/*
name:           DBPrep.js
author:         David Cathers
created:        16/06/2016
references:     MDN
description:    the class used to create templates and entries from DBTmplt and
                DBEntry
*/

const DBEntry = require("./DBEntry.js");
const DBTmplt = require("./DBTmplt.js");

/*
class DBPrep
used to prep templats and create DBEntry classes from the given templates
*/
const DBPrep = function() {

    var templates = [];

    /*
    function findTemplate
    searches for the desrided template and then returns that template if found
    @params: get_tmplt [string], the name of the template to retrieve
    @return: [object || boolean], if found then returns the template, else
            returns false
    */
    const findTemplate = (get_tmplt) => {
        for(var value of templates) {
            if(value.getName() === get_tmplt) {
                return value.getTmplt();
            }
        }
        return false;
    }

    /*
    function createTmplt
    creates a new DBTmplt from the given name and object
    @params: template_name [string], the name given to the template
    @params: template_obj [object], the object to create the template from
    */
    this.createTmplt = (template_name,template_obj) => {
        if(template_name && template_obj) {
            templates.push(new DBTmplt(template_name,template_obj));
        } else {
            if(!template_name) { console.log("no name given"); }
            if(!template_obj) { console.log("not object given"); }
            console.log("template not created\n");
        }
    }

    /*
    function createEntry
    returns a DBEntry from the desrided template name and can set the entry to
    the given data
    @params: get_template [string], the name of the template to retrieve
    @params: entry_data [object] (optional), the data to assign to the DBEntry
            class
    @return: [object || class], if the template is found then returns a new
            DBEntry class, else returns an empty object
    */
    this.createEntry = (get_template,entry_data) => {
        var desired_template = findTemplate(get_template);
        if(desired_template) {
            return new DBEntry(get_template,desired_template,entry_data);
        } else {
            console.log(get_template,"was not found, entry was not created");
            return {};
        }
    }
}

module.exports = DBPrep;
