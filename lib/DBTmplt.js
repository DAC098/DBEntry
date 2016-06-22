/*
name:           DBTmplt.js
author:         David Cathers
created:        15/06/2016
references:     MDN
description:    the class used to create templates to be used for DBEntry
*/

/*
function cloneObj
creates a clone of the object given, is called recursively
@params: obj [object], the object to be cloned
@return: [object], the clone of the object given
*/
const cloneObj = (obj) => {
    var rtn = {};
    for(const key in obj) {
        if(typeof obj[key] === "object" && !Array.isArray(obj[key]) && (Object.keys(obj[key])).length !== 0) {
            rtn[key] = cloneObj(obj[key]);
        } else {
            var variable = obj[key];
            rtn[key] = variable;
        }
    }
    return rtn;
}

/*
class DBTmplt
used to create template objects from the given object and set it to the desired
name given
@params: constructor_tmplt_name [string], the name of the template
@params: constructor_tmplt_obj [object], the object to make the template from
*/
const DBTmplt = function(constructor_tmplt_name,constructor_tmplt_obj) {

    // stores the generated template for quick access
    var tmplt = {};
    //the name of the template for this class
    const tmplt_name = constructor_tmplt_name;
    // the define template object to be given to values
    const value_obj = {
        var_type: "",
        original_value: undefined,
        var_value: undefined,
        value_changed: false,
        is_empty: true,
        check_type: "",
        var_check: undefined,
        retriever: undefined, // currently not being actively used but maybe later
    }

    /*
    function valueType
    determines the type for the variable passed in
    @params: get_type [unknown], an unknown variable to get the type of
    @return: [string], the determined value type of the given variable
    */
    const valueType = (get_type) => {
        return (Array.isArray(get_type)) ? "array" : typeof get_type;
    }

    const checkType = (get_type) => {
        switch (get_type) {
            case "string":
                return "regex";
                break;
            case "number":
                return "range";
                break;
            default:
                return "";
        }
    }

    /*
    function getObjectValues
    creates a cloned object from value_obj and sets it with the given value
    @params: new_key_value [unknown], the value to be given to the object
    @return: [object], the object cloned from value_obj
    */
    const getObjectValue = (new_key_value,value_check) => {
        // create a clone of the value_obj
        var rtn = cloneObj(value_obj);
        // set the value of the cloned object equal to the value passed in
        rtn.var_value = new_key_value;
        // set the type of the cloned object by based on the type of value
        // given to it
        rtn.var_type = valueType(rtn.var_value);
        rtn.check_type = checkType(rtn.var_type);
        rtn.var_check = (value_check) ? value_check : rtn.var_check;
        // set getValue as the retriever for the key
        if(rtn.var_type === "boolean") {
            rtn.is_empty = false;
        }
        //rtn.retriever = getValue; // will leave this in just incase I can use it for something
        // return the cloned object
        return rtn;
    }

    /*
    function getObjectContainer
    creates a cloned object from value_obj and sets it to be a container
    @return: [object], the object cloned from value_obj and set as a container
    */
    const getObjectContainer = () => {
        // create a clone of the value_obj
        var rtn = cloneObj(value_obj);
        // since object is know to be a container, set type to container
        rtn.var_type = "container";
        // containers can never be empty
        rtn.is_empty = false;
        // return cloned object
        return rtn;
    }

    /*
    function initTmplt
    a recursive function used to set the default state of the private variable
    current to be sued by the class
    @params: tmplt_ref [object], the reference position to begin creating the
            tmplt
    @params: tmplt_reg_ref [object], the reference position to give template
            values regex
    @return: [object], the generated object to be returned
    */
    const initTmplt = (tmplt_ref,tmplt_reg_ref) => {
        var rtn = {};
        // cycle thru keys in the current reference of the tmplt_ref
        for(var key in tmplt_ref) {
            // set the constant to key incase key changes
            const original_key = key;
            // check to see if the tmplt_ref has any keys
            if( (Object.keys(tmplt_ref[key])).length === 0 ) {
                if(tmplt_reg_ref[key]) {
                    rtn[key] = getObjectValue(tmplt_ref[key],tmplt_reg_ref[key]);
                } else {
                    // if no keys then create the object
                    rtn[key] = getObjectValue(tmplt_ref[key]);
                }
            } else {
                // if any keys the create a container
                rtn[key] = getObjectContainer();
                // recursively call the function and start at new position of
                // tmplt_ref
                rtn[key].var_value = initTmplt(tmplt_ref[key],tmplt_reg_ref[key]);
            }
        }
        // return the generated object
        return rtn;
    }

    /*
    function createTmplt
    creates and sets tmplt to the desired object given
    @params: new_tmplt_obj [object], the object to derive a template from
    */
    this.createTmplt = (new_tmplt_obj,new_tmplt_regex) => {
        tmplt = initTmplt(new_tmplt_obj,new_tmplt_regex);
    }

    /*
    function getName
    returns the name of the template
    @return: [string], the name of the template
    */
    this.getName = () => {
        return tmplt_name;
    }

    /*
    function getTmplt
    returns a clone of the template for the class
    @return: [object], the cloned tmplt
    */
    this.getTmplt = () => {
        return cloneObj(tmplt);
    }

    if(constructor_tmplt_obj) { this.createTmplt(constructor_tmplt_obj); }
}

module.exports = DBTmplt;
