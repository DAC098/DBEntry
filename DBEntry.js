try {
    const util = require("util");
} catch(e) {

}

/*

example of current once set:

{
    pk: {
        var_value: "95",
        var_type: string,
        is_empty: false
    },
    username: {
        var_value: "",
        var_type: string,
        is_empty: true,
    },
    name: {
        var_type: object,
        is_empty: false,
        var_value: {
            first: {
                var_value: "bob",
                var_type: string,
                is_empty: false,
            },
            last: {
                var_value: "stevenson",
                var_type: string,
                is_empty: false,
            }
        }
    },
    email: {
        var_value: "bob@dac.com",
        var_type: string,
        is_empty: false
    },
    admin: {
        var_value: false,
        var_type: boolean,
        is_empty: false,
    }
}
*/

const DBEntry = function(construct_type,construct_data) {

    // hard set templates to use for the class, maybe have something later that
    // would seperate the two
    const template = {
        test: {
            name: "",number: 0,cool: false
        },
        user: {
            pk: "",username: "",name: {first: "",last: ""},email: "",admin: false
        },
        post: {
            pk: Number,title: String,body: String,created: String,username: String
        }
    };

    // the object template for the values to be created from the above
    // templates, each key value pair will be given this object to be used
    // later by other functions
    const value_obj = {
        var_type: "",
        var_value: undefined,
        is_empty: true,
        retriever: undefined,
        init: false,
    }

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
            case "container":
                return false;
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

    // used to keep a know reference to the class incase "this" could reference
    // to a function class or other reason
    const self = this;
    // current is what the class class for its setters and getters, the class
    // only holds a link to current so as to have controlled setters and
    // getters
    var current = {};
    // set is used to determine if the class was properly initialized
    var set = false;
    // type is set to the key of the template being used
    var type = "";

    const getContainer = (current_ref) => {
        var rtn = {};
        for(key in current_ref) {
            if(current_ref[key].var_type === "container") {
                rtn[key] = getContainer(current_ref[key].var_value);
            } else {
                rtn[key] = current_ref[key].var_value;
            }
        }
        return rtn;
    }

    const getValue = (current_ref) => {
        return current_ref;
    }

    const setValue = (current_ref,key_name,new_value) => {
        if(valueCheck(current_ref.var_type,new_value) || (current_ref.var_type === "container" && !current_ref.init)) {
            console.log("setting",key_name,"with",new_value,"\n");
            current_ref.var_value = new_value;
        } else {
            if(current_ref.var_type === "container") {
                console.log("containers cannot be overriden\n");
            } else {
                console.log("invalid type passed to",key_name,"requires",current_ref.var_type,"\n");
            }
        }
        console.log("var_value:",current_ref.var_value,"\nvar_type:",current_ref.var_type,"\ninit:",current_ref.init,"\n");
    }

    /*
    function getObjectValues
    creates a cloned object from value_obj and sets
    */
    const getObjectValues = (new_key_value) => {
        // create a clone of the value_obj
        var rtn = Object.assign({},value_obj);
        // set the value of the cloned object equal to the value passed in
        rtn.var_value = new_key_value;
        // set the type of the cloned object by based on the type of value
        // given to it
        rtn.var_type = valueType(rtn.var_value);
        // set getValue as the retriever for the key
        rtn.retriever = getValue;
        // return the cloned object
        return rtn;
    }

    /*
    function retrieveTemplate
    used to retrieve the desired template and then set to current
    @params: tmplt_type [string], the key name of the template to be retrieved
    @return: [object], the object returned from setCurrent
    */
    const retrieveTemplate = (tmplt_type) => {
        var desired_tmplt = template[tmplt_type];
        return setCurrent(desired_tmplt);
    }

    /*
    function setCurrent
    a recursive function used to set the default state of the private variable
    current to be sued by the class
    @params: set_to_current [object], the object to be set to current
    @return: [object], the generated object to be given to current
    */
    const setCurrent = (set_to_current) => {
        console.log("creating object from\n",set_to_current,"\n");
        var rtn = {};
        // begin cycling thru the current set of keys for the object given
        for(key in set_to_current) {
            var original_key = key;
            // check if the key is an object by getting the number of keys it
            // might have, if object has any keys then its considered a
            // container
            if( (Object.keys(set_to_current[key])).length === 0 ) {
                rtn[key] = getObjectValues(set_to_current[key]);
                console.log(key,"created\n");
            } else {
                console.log("preparing to create container",key,"\n");
                // create the key as if its not a container
                rtn[key] = Object.assign({},value_obj);
                // specify the type explicitly
                rtn[key].var_type = "container";
                // can never be empty
                rtn[key].is_empty = false;
                // specify getContainer as the retriever for the container
                rtn[key].retriever = getContainer;
                // set the value of the container equal to the keys of the
                // container
                rtn[key].var_value = setCurrent(set_to_current[key]);
                console.log(original_key,"container created\n");
            }
        }
        console.log("returning results setCurrent\n");
        return rtn;
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
    const createSelfRef = (key_name,self_ref,current_ref) => {

        console.log("creating self reference");
        console.log("    key:",key_name);
        console.log("    self_ref:",self_ref);
        console.log("    current_ref:",current_ref,"\n");

        // create keys for the current reference position of the class and set
        // to the appropriate reference position of current
        Object.defineProperty(self_ref,key_name,{
            get: () => {
                return  current_ref[key_name].retriever(current_ref[key_name].var_value); //current_ref[key_name].var_value;
            },
            set: (new_value) => {
                console.log("\ncalling settter for",key_name);
                // the the key being called is a container then deny setter
                /*
                if(current_ref[key_name].var_type === "container") {
                    console.log("cannot set a new value to a container\nset failed\n");
                } else {
                    // check to make sure that the value being based to setter
                    // is the proper type
                    if(valueCheck(current_ref[key_name].var_type,new_value)) {
                        console.log("setting",new_value,"to",key_name,"\n");
                        current_ref[key_name].var_value = new_value;
                    } else {
                        console.log("invalid type passed to",key_name,"requires",current_ref[key_name].var_type,"\n");
                    }
                }
                */
                setValue(current_ref[key_name],key_name,new_value);
            }
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
        for(key in current_ref) {
            var original_key = key;
            console.log("key:",key,"\ncontents:",current_ref[key],"\n");
            if( current_ref[key].var_type === "container" ) {
                console.log(key,"is container\ncreating reference for container\n");
                createSelfRef(key,self_ref,current_ref);
                console.log("creating reference for container contents",original_key);
                createRetrievableObject(self_ref[original_key],current_ref[original_key].var_value);
                console.log("container contents set\n");
            } else {
                console.log("creating reference for key",key);
                createSelfRef(key,self_ref,current_ref);
            }
            current_ref[original_key].init = true;
            console.log("key:",key,"\noriginal_key:",original_key,"\n");
        }
    }

    /*
    function initEntry
    initializes the class with the desired template, can be called directly or
    called when variables are passed to the conttructor of the class
    @params: tmplt_type [string], the key name of the template to use
    */
    this.initEntry = (tmplt_type) => {
        if(tmplt_type in template) {
            console.log("------------------------------\n");
            console.log("setting current\n");
            console.log("------------------------------\n");
            current = retrieveTemplate(tmplt_type);
            set = true;
            type = tmplt_type;
            console.log("------------------------------\n");
            console.log("connecting current to self\n");
            console.log("------------------------------\n");
            createRetrievableObject(self,current);
            console.log("init complete\n");
        } else {
            console.log("invalid template type, entry is not set");
            console.log("init failed");
        }
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
            for(key in data) {
                this[key] = data[key];
            }
            return true;
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
            for(key in current) {
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
            var empty_obj = retrieveTemplate();
            for(key in empty_obj) {
                this[key] = empty_obj[key];
            }
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
    const cycleCurrent = (current_ref) => {
        var rtn = {};
        for(key in current_ref) {
            if(current_ref[key].var_type === "container") {
                rtn[key] = cycleCurrent(current_ref[key].var_value);
            } else {
                rtn[key] = current_ref[key].var_value;
            }
        }
        return rtn;
    }

    /*
    function getEntry
    returns the current set of data for the class
    @return: [object], all data values currently in the class
    */
    this.getEntry = () => {
        return cycleCurrent(current);
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
    function whatType
    the template used to initialize the class
    @return: [string], the value of type
    */
    this.whatType = () => {
        return type;
    }

    // temporary, just to see the full contents of current
    this.logCurrent = () => {
        try {
            console.log("logging current:\n",util.inspect(current,false,null));
        } catch(e) {
            console.log("loggin current:\n",current);
        }
    }

    const checkCurrent = (exclude_object,current_ref) => {
        var rtn_obj = {};
        exclude_object = (exclude_object) ? exclude_object : {};
        for(key in current_ref) {
            if(current_ref[key].var_type === "container") {
                var temp = checkCurrent(exclude_object,current_ref[key].var_value)
                if((temp.keys()).length !== 0) {
                    rtn[key] = temp;
                }
            } else {
                if( !(key in exclude_object) ) {
                    rtn[key] = true;
                }
            }
        }
        return rtn;
    }

    this.checkForEmpty = (exclude_object) => {
        exclude_object = (exclude_object) ? exclude_object : {};
        return checkCurrent(exclude_object,current);
    }

    if(typeof construct_type !== "undefined") { this.initEntry(construct_type); }
    if(typeof construct_data !== "undefined") { this.setEntry(construct_data); }
}

try {
    module.exports = DBEntry;
} catch(e) {

}
