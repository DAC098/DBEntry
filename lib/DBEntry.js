const util = require("util");

const cloneObj = (obj) => {
    var rtn = {};
    for(const key in obj) {
        //console.log("current key",key);
        //console.log("--typeof:",typeof obj[key]);
        //console.log("--value:",obj[key]);
        if(typeof obj[key] === "object" && !Array.isArray(obj[key]) && (Object.keys(obj[key])).length !== 0) {
            //console.log("recursive call for",key);
            rtn[key] = cloneObj(obj[key]);
        } else {
            var variable = obj[key];
            rtn[key] = variable;
        }
    }
    return rtn;
}

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

    /*
    function valueType
    determines the type for the variable passed in
    @params: get_type [unknown], an unknown variable to get the type of
    @return: [string], the determined value type of the given variable
    */
    const valueType = (get_type) => {
        return (Array.isArray(get_type)) ? "array" : typeof get_type;
    }

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
    */
    const getValue = (current_ref,key_name) => {
        return current_ref[key_name].var_value;
    }

    const setValue = (current_ref,key_name,new_value) => {
        if(valueCheck(current_ref.var_type,new_value)) {
            //console.log("setting",key_name,"with",new_value,"\n");
            current_ref.var_value = new_value;
            current_ref.is_empty = checkEmpty(current_ref.var_type,current_ref.var_value);
        } else {
            console.log("invalid type passed to",key_name,"requires",current_ref.var_type,"\n");
        }
        //console.log("var_value:",current_ref.var_value,"\nvar_type:",current_ref.var_type,"\ninit:",current_ref.init,"\n");
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
    function createSelfRef
    creates a key to be given to the class that will allow the user to easily
    access the values of the private variable current
    example:
    -- for basic value
    -- this.key returns current.key.var_value
    --
    -- for container
    -- this.container.key returns current.container.var_value.key.var_value
    @params: key_name [string], key name to be make for the class
    @params: self_ref [object], the reference position for the class
    @params: current_ref [object], the reference position for current to be
            accessed
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
                //console.log("\ncalling settter for",key_name);
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

    const createSelfContainer = (key_name,self_ref,current_ref) => {

        Object.defineProperty(self_ref,key_name,{
            //value: getContainer(current_ref[key_name].var_value),
            value: {},
            writable: true,
            enumerable: true,
            configurable: true
        });
    }

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
        //console.log("setting reference to DBEntry\n    self_ref:",self_ref,"\n    current_ref:",current_ref,"\n");
        for(const key in current_ref) {
            //console.log("key:",key,"\ncontents:",current_ref[key],"\n");
            if( current_ref[key].var_type === "container" ) {
                //console.log(key,"is container, creating reference for container\n");
                createSelfContainer(key,self_ref,current_ref);
                //console.log("creating content reference for container:",original_key,"\n");
                createRetrievableObject(self_ref[key],current_ref[key].var_value);
                //console.log("contents set for container:",original_key,"\n");
                //console.log("restricting container:",original_key,"\n");
                restrictSelfContainer(key,self_ref);
            } else {
                //console.log("creating reference for key",key);
                createSelfValue(key,self_ref,current_ref);
            }
            //console.log("key:",key,"\noriginal_key:",original_key,"\n");
        }
    }

    /*
    function initEntry
    initializes the class with the desired template, can be called directly or
    called when variables are passed to the conttructor of the class
    @params: tmplt_type [string], the key name of the template to use
    */
    this.initEntry = () => {
        console.log("------------------------------\nsetting current\n------------------------------\n");
        current = retrieveTemplate();
        //this.logCurrent();
        set = true;
        console.log("------------------------------\nconnecting current to class\n------------------------------\n");
        createRetrievableObject(self,current);
        console.log("------------------------------\ninit complete\n------------------------------\n");
    }

    const setEntryCycle = (data_ref,current_ref,template_ref) => {
        for(const key in data_ref) {
            if(key in current_ref) {
                if( (Object.keys(data_ref[key])).length !== 0 && current_ref[key].var_type === "container") {
                    setEntryCycle(data_ref[key],current_ref[key].var_value,template_ref[key].var_value);
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
            return setEntryCycle(data_clone,current,template);
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
    function cycleCurrent
    a recursive function that cycles thru all the necessary keys and retrieves
    their values
    @params: current_ref [object], the current position of current to begin
            cycling
    @return: [object], the current set of key value pairs retrieved from current
    */
    const getEntryCycle = (retrieval_type,key_object,current_ref,force_value) => {
        var rtn = {};
        if(retrieval_type) {
            key_object = (key_object && typeof key_object === "object") ? key_object : {};
            switch (retrieval_type) {
                case "exclude":
                    for(const key in current_ref) {
                        if(!(key in key_object) || (Object.keys(key_object[key])).length !== 0 ) {
                            if(current_ref[key].var_type === "container") {
                                rtn[key] = getEntryCycle(retrieval_type,key_object[key],current_ref[key].var_value);
                            } else {
                                rtn[key] = current_ref[key].var_value;
                            }
                        }
                    }
                    break;
                case "include":
                    for(const key in current_ref) {
                        if((key in key_object) || force_value) {
                            if(current_ref[key].var_type === "container") {
                                force_value = (Object.keys(key_object[key])).length === 0;
                                rtn[key] = getEntryCycle(retrieval_type,key_object[key],current_ref[key].var_value,force_value);
                                force_value = false;
                            } else {
                                rtn[key] = current_ref[key].var_value;
                            }
                        }
                    }
                    break;
                default:
                    console.log("invalid argument for retrieval_type, no option for",retrieval_type);
            }
        } else {
            for(const key in current_ref) {
                if(current_ref[key].var_type === "container") {
                    rtn[key] = getEntryCycle(retrieval_type,key_object,current_ref[key].var_value);
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

    const checkForEmptyCycle = (is_required_set,require_object_ref,current_ref,force_value) => {
        var rtn = {
            result: false,
            found: {}
        };
        //console.log("require_object_ref:",require_object_ref);
        force_value = (force_value) ? force_value : false;
        require_object_ref = (require_object_ref && typeof require_object_ref === "object") ? require_object_ref : {};
        if(is_required_set) {
            console.log("running required method\n");
            for(const key in current_ref) {
                //console.log("checking",key,"\n");
                var key_in_object_bool = (require_object_ref) ? key in require_object_ref : false;
                if(key_in_object_bool || force_value) {
                    if(current_ref[key].var_type === "container") {
                        force_value = typeof require_object_ref[key] === "object" && (Object.keys(require_object_ref[key])).length === 0;
                        var temp = checkForEmptyCycle(is_required_set,require_object_ref[key],current_ref[key].var_value,force_value);
                        if( temp.result ) {
                            //console.log("container had empty values",temp.found,"\n");
                            rtn.result = true;
                            rtn.found[key] = temp.found;
                        }
                        force_value = false;
                    } else {
                        if(current_ref[key].is_empty) {
                            //console.log(key,"is empty\n");
                            rtn.result = true;
                            rtn.found[key] = true;
                        }
                    }
                }
            }
        } else {
            console.log("running global method\n");
            for(const key in current_ref) {
                //console.log("checking",key,"\n");
                if(current_ref[key].var_type === "container") {
                    var temp = checkForEmptyCycle(is_required_set,require_object_ref,current_ref[key].var_value);
                    if(temp.result) {
                        //console.log("container had empty values",temp.found,"\n");
                        rtn.result = true;
                        rtn.found[key] = temp.found;
                    }
                } else {
                    if(current_ref[key].is_empty) {
                        //console.log(key,"is empty\n");
                        rtn.result = true;
                        rtn.found[key] = true;
                    }
                }
            }
        }
        return rtn;
    }

    this.checkForEmpty = (require_object) => {
        console.log("\nchecking for empty values\n");
        var is_required = (require_object && typeof require_object === "object") ? true : false;
        console.log("is_required:",is_required,"\n");
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
