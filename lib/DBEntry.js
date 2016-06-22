/*
name:           DBEntry.js
author:         David Cathers
created:        14/06/2016
references:     MDN
description:    see below
*/

const util = require("util");

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
class DBEntry
is a control class that allows for the easy manipulation of data that can have
checks run on it and can return specifc data of the class
@params: construct_type [string], the name of the template to be used
@params: construct_tmplt [object], the template object to be used for the class
@params: construct_data [object] (optional), the data to fill the class with
        once created
*/
const DBEntry = function(construct_type,construct_tmplt,construct_data) {

    // used to keep a know reference to the class incase "this" could reference
    // to a function class or other reason
    const self = this;
    // current is what the class uses for its setters and getters, the class
    // only holds a link to current so as to have controlled setters and
    // getters
    var current = {};
    // set is used to determine if the class was properly initialized
    var set = false;
    // type is set to the key of the template being used
    var template_name = construct_type;
    // the template for the class
    const template = construct_tmplt;

    /*
    function valueCheck
    checks the type of a given value against what the value needs to be
    @params: against_type [string], the variable type to compare check against
    @params: check [unknown], the variable to check
    @return: [boolean], if the type of check is equal to that of against_type
            then true, else false
    */
    const valueCheck = (against_type,check) => {
        switch (against_type) {
            case "array":
                return Array.isArray(check);
                break;
            default:
                return typeof check === against_type;
        }
    }

    const regCheck = (current_ref,new_value) => {
        if(current_ref.reg_check) {
            return current_ref.reg_check.test(new_value);
        }
        return true;
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

    /*
    function checkEmpty
    performs a basic check on the value being given
    @params: value_type [string], the type of check to perform
    @params: value_data [unknown], the value to check
    */
    const checkEmpty = (value_type,value_data) => {
        switch (value_type) {
            case "string":
                return value_data.length === 0;
                break;
            case "number":
                return value_data === 0;
                break;
            case "boolean":
                return false;
                break;
            case "object":
                return (Object.keys(value_data)).length === 0;
                break;
            case "array":
                return value_data.length === 0;
                break;
        }
    }

    /*
    function getValue
    returns the value for the desired reference to current
    @return: [unknown], the value of the current reference
    */
    const getValue = (current_ref,key_name) => {
        return current_ref[key_name].var_value;
    }

    /*
    function setValue
    runs checks for the values in current to assure that they stay there
    original variable type
    @params: current_ref [&object], the reference to current
    @params: key_name [string], the name of the key beign checked
    @params: new_value [unknown], the new value possibly being given to the value
            being referenced
    */
    const setValue = (current_ref,key_name,new_value) => {
        if(valueCheck(current_ref.var_type,new_value) && regCheck(current_ref,new_value)) {
            current_ref.var_value = new_value;
            current_ref.value_changed = (new_value === current_ref.original_value) ? false : true;
            current_ref.is_empty = checkEmpty(current_ref.var_type,current_ref.var_value);
        } else {
            console.log("invalid type passed to",key_name,"requires",current_ref.var_type,"\n");
        }
    }

    /*
    function retrieveTemplate
    used to retrieve the desired template and then set to current
    @return: [object], the object cloned from template
    */
    const retrieveTemplate = () => {
        return cloneObj(template);
    }

    /*
    function createSelfValue
    creates a key to be given to the class that will allow the user to easily
    access the values of the private variable current
    example:
    -- for basic value
    -- this.key returns current.key.var_value
    --
    -- for container
    -- this.container.key returns current.container.var_value.key.var_value
    @params: key_name [string], key name to be make for the class
    @params: self_ref [&object], the reference for the class
    @params: current_ref [&object], the reference for current to be accessed
    */
    const createSelfValue = (key_name,self_ref,current_ref) => {
        /*
        console.log("\n----------\ncreating self reference");
        console.log("    key:",key_name);
        console.log("    self_ref:",self_ref,"\n");
        */
        // create keys for the current reference position of the class and set
        // to the appropriate reference position of current
        Object.defineProperty(self_ref,key_name,{
            get: () => {
                return  getValue(current_ref,key_name);
            },
            set: (new_value) => {
                setValue(current_ref[key_name],key_name,new_value);
            },
            enumerable: true,
            configurable: false,
        });
        /*
        console.log("object property created");
        console.log("    self_ref:",self_ref,"\n----------\n");
        */
    }

    /*
    function createSelfContainer
    creates a container for the class as to allow for further keys to be assign
    to the container it references
    @params: key_name [string], the key name for the container
    @params: self_ref [&object], the reference to the class
    @params: current_ref [&object], the reference to current
    */
    const createSelfContainer = (key_name,self_ref,current_ref) => {

        Object.defineProperty(self_ref,key_name,{
            value: {},
            writable: true,
            enumerable: true,
            configurable: true
        });
    }

    /*
    function restrictSelfContainer
    once the container is made, make the container so that it cannot be deleted
    or changed from its original state
    @params: key_name [string], the key name for the container
    @params: self_ref [&object], the reference to the class
    @params: current_ref [&object], the reference to current
    */
    const restrictSelfContainer = (key_name,self_ref,current_ref) => {
        Object.defineProperty(self_ref,key_name,{
            writable: false,
            configurable: false,
        });
    }

    /*
    function createRetrievableObject
    called to cycle thru the keys in current and then create references for
    the class to access current, will be called recursively if the key is a
    container
    @params: self_ref [object], the reference to the class
    @params: current_ref [object], the current reference to the variable current
    */
    const createRetrievableObject = (self_ref,current_ref) => {
        for(const key in current_ref) {
            if( current_ref[key].var_type === "container" ) {
                createSelfContainer(key,self_ref,current_ref);
                createRetrievableObject(self_ref[key],current_ref[key].var_value);
                restrictSelfContainer(key,self_ref);
            } else {
                createSelfValue(key,self_ref,current_ref);
            }
        }
    }

    /*
    function initEntry
    initializes the class with the desired template, can be called directly or
    called when variables are passed to the conttructor of the class
    @params: tmplt_type [string], the key name of the template to use
    */
    this.initEntry = () => {
        current = retrieveTemplate();
        set = true;
        createRetrievableObject(self,current);
    }

    /*
    function setEntryCycle
    cycles thru the given object and sets current to that value
    @params: data_ref [&object], the data object to set current to
    @params: current_ref [&object], the reference to current
    @return: [boolean], return true upon completion
    */
    const setEntryCycle = (data_ref,current_ref) => {
        for(const key in data_ref) {
            if(key in current_ref) {
                if( (Object.keys(data_ref[key])).length !== 0 && current_ref[key].var_type === "container") {
                    setEntryCycle(data_ref[key],current_ref[key].var_value);
                } else {
                    setValue(current_ref[key],key,data_ref[key]);
                }
            }
        }
        return true;
    }

    /*
    function setEntry
    after initialization of the class, this can be called to fill the class with
    data. can be called by the constructor if argument is given or be called
    directly
    @params: data [object], the data to fill the class with
    @return: [boolean], on success return true, if error return false
    */
    this.setEntry = (data) => {
        if(set) {
            var data_clone = cloneObj(data);
            return setEntryCycle(data_clone,current);
        } else {
            console.log("cannot set new data if entry is not set");
            return false;
        }
    }

    /*
    function clearEntry
    clears data from the class and removes accessors from the class as well,
    class must have been initialized
    @return: [boolean], returns true on success, else false
    */
    this.clearEntry = () => {
        if(set) {
            for(const key in current) {
                delete this[key];
            }
            current = {};
            set = false;
            return true;
        } else {
            console.log("entry was never set, no data to clear");
            return false;
        }
    }

    /*
    function emptyEntry
    clears data from the class and resets current to be empty, class must have
    been initialized
    @return: [boolean], returns true on success, else false
    */
    this.emptyEntry = () => {
        if(set) {
            current = retrieveTemplate();
            return true;
        } else {
            console.log("entry was not set, no data to empty");
            return false;
        }
    }

    /*
    function getEntryCycle
    a recursive function that cycles thru all the specfied keys and retrieves
    their values
    @params: retrieval_type [string], the type of retrival to perform, can be
            undefined
    @params: key_object_ref [&object], the reference to the object that states
            what values to get / reject, can be undefined
    @params: current_ref [object], the reference to current
    @params: container_force [boolean], used to deteremine if a container is
            to be searched, can be undefined
    @return: [object], the current set of key value pairs retrieved from current
    */
    const getEntryCycle = (retrieval_type,key_object_ref,current_ref,container_force) => {
        var rtn = {};
        // if retrieval_type is defined
        if(retrieval_type) {
            // make sure that key_object_ref is an object and not undefined
            key_object_ref = (key_object_ref && typeof key_object_ref === "object") ? key_object_ref : {};
            switch (retrieval_type) {
                case "exclude":
                    // cycle thru current_ref
                    for(const key in current_ref) {
                        // check to make sure that the key is in key_object_ref
                        if(!(key in key_object_ref) || (Object.keys(key_object_ref[key])).length !== 0 ) {
                            // check if the key in current_ref is a container
                            if(current_ref[key].var_type === "container") {
                                // if so run recursive call
                                rtn[key] = getEntryCycle(retrieval_type,key_object_ref[key],current_ref[key].var_value);
                            } else {
                                rtn[key] = current_ref[key].var_value;
                            }
                        }
                    }
                    break;
                case "include":
                    // set to allow the loop to continue when container_force
                    // is set to false
                    var container_continue = container_force;
                    // cycle thre current_ref
                    for(const key in current_ref) {
                        // check to see if the key is in key_object_ref and
                        // key_object_ref is not undefined
                        var key_in_object_bool = (key_object_ref) ? key in key_object_ref : false;
                        // run check to see what to get and what to skip
                        if(key_in_object_bool || container_force || container_continue) {
                            if(current_ref[key].var_type === "container") {
                                container_force = typeof key_object_ref[key] === "boolean" || container_force;
                                rtn[key] = getEntryCycle(retrieval_type,key_object_ref[key],current_ref[key].var_value,container_force);
                            } else {
                                rtn[key] = current_ref[key].var_value;
                            }
                            container_force = false;
                        }
                    }
                    break;
                default:
                    console.log("invalid argument for retrieval_type, no option for",retrieval_type);
            }
        } else {
            for(const key in current_ref) {
                if(current_ref[key].var_type === "container") {
                    rtn[key] = getEntryCycle(retrieval_type,key_object_ref,current_ref[key].var_value);
                } else {
                    rtn[key] = current_ref[key].var_value;
                }
            }
        }
        return rtn;
    }

    /*
    function getEntry
    returns the current set of data for the class
    @return: [object], all data values currently in the class
    */
    this.getEntry = (retrieval_type,key_array) => {
        return getEntryCycle(retrieval_type,key_array,current);
    }

    /*
    function isSet
    returns the current state of the class and if it has been initialized
    @return: [boolean], the value of set
    */
    this.isSet = () => {
        return set;
    }

    /*
    function whatTmplt
    the template used to initialize the class
    @return: [string], the name of the template
    */
    this.whatTmplt = () => {
        return templates_name;
    }

    // temporary, just to see the full contents of current
    this.logCurrent = () => {
        console.log("logging current:\n",util.inspect(current,false,null));
    }

    /*
    function checkForEmptyCycle
    called to cycle thru current and return an object with all the keys that
    are empty inside of current, is called recursively
    @params: is_required_set [boolean], determines what operation to perform
    @params: require_object_ref [&object], the reference to the object that
            states what to look for, can be undefined
    @params: current_ref [&object], the reference to current
    @params: container_force [boolean], used to decide if the function should
            search a container or skip it, can be undefined
    @return: [object], the object that states whether or not if found empty
            values, if found then will state what keys
    */
    const checkForEmptyCycle = (is_required_set,require_object_ref,current_ref,container_force) => {
        var rtn = {
            result: false,
            found: {}
        };
        require_object_ref = (require_object_ref && typeof require_object_ref === "object") ? require_object_ref : {};
        if(is_required_set) {
            var container_continue = container_force
            for(const key in current_ref) {
                var key_in_object_bool = (require_object_ref) ? key in require_object_ref : false;
                if(key_in_object_bool || container_force || container_continue) {
                    if(current_ref[key].var_type === "container") {
                        container_force = typeof require_object_ref[key] === "boolean" || container_force;
                        var temp = checkForEmptyCycle(is_required_set,require_object_ref[key],current_ref[key].var_value,container_force);
                        container_force = false;
                        if( temp.result ) {
                            rtn.result = true;
                            rtn.found[key] = temp.found;
                        }
                    } else {
                        if(current_ref[key].is_empty) {
                            rtn.result = true;
                            rtn.found[key] = true;
                        }
                    }
                }
            }
            container_continue = false;
        } else {
            for(const key in current_ref) {
                if(current_ref[key].var_type === "container") {
                    var temp = checkForEmptyCycle(is_required_set,require_object_ref,current_ref[key].var_value);
                    if(temp.result) {
                        rtn.result = true;
                        rtn.found[key] = temp.found;
                    }
                } else {
                    if(current_ref[key].is_empty) {
                        rtn.result = true;
                        rtn.found[key] = true;
                    }
                }
            }
        }
        return rtn;
    }

    /*
    function checkForEmpty
    will check for empty values in current
    @params: require_object [object] (optional), checks for these value
            explicitly
    @return: [object], the results from checkForEmptyCycle
    */
    this.checkForEmpty = (require_object) => {
        var is_required = (require_object && typeof require_object === "object" && !Array.isArray(require_object)) ? true : false;
        return checkForEmptyCycle(is_required,require_object,current);
    }

    for(func_key in this) {
        Object.defineProperty(this,func_key,{
            enumerable: false,
            configurable: false,
            writable: false,
        });
    }

    this.initEntry();
    if(typeof construct_data !== "undefined") { this.setEntry(construct_data); }
}

module.exports = DBEntry;
