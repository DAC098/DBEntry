const DBEntry = require("./DBEntry.js");
const DBTmplt = require("./DBTmplt.js");

const DBClass = function() {

    var templates = [];

    const findTemplate = (get_tmplt) => {
        for(var value of templates) {
            if(value.getName() === get_tmplt) {
                return value.getTmplt();
            }
        }
        return false;
    }

    this.createTmplt = (template_name,template_obj) => {
        if(template_name && template_obj) {
            templates.push(new DBTmplt(template_name,template_obj));
        } else {
            if(!template_name) { console.log("no name given"); }
            if(!template_obj) { console.log("not object given"); }
            console.log("template not created\n");
        }
    }

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

module.exports = DBClass;
