
const DBTmplt = function(constructor_tmplt_name,constructor_tmplt_obj) {

    // stores the generated template for quick access
    var tmplt = {};
    //the name of the template for this class
    const tmplt_name = constructor_tmplt_name;
    // the define template object to be given to values
    const value_obj = {
        var_type: "",
        var_value: undefined,
        is_empty: true,
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

    /*
    function getObjectValues
    creates a cloned object from value_obj and sets
    */
    const getObjectValue = (new_key_value) => {
        // create a clone of the value_obj
        var rtn = Object.assign({},value_obj);
        // set the value of the cloned object equal to the value passed in
        rtn.var_value = new_key_value;
        // set the type of the cloned object by based on the type of value
        // given to it
        rtn.var_type = valueType(rtn.var_value);
        // set getValue as the retriever for the key
        if(rtn.var_type === "boolean") {
            rtn.is_empty = false;
        }
        //rtn.retriever = getValue; // will leave this in just incase I can use it for something
        // return the cloned object
        return rtn;
    }

    const getObjectContainer = () => {
        // create a clone of the value_obj
        var rtn = Object.assign({},value_obj);
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
    @return: [object], the generated object to be returned
    */
    const initTmplt = (tmplt_ref) => {
        var rtn = {};
        // cycle thru keys in the current reference of the tmplt_ref
        for(var key in tmplt_ref) {
            // set the constant to key incase key changes
            const original_key = key;
            // check to see if the tmplt_ref has any keys
            if( (Object.keys(tmplt_ref[key])).length === 0 ) {
                // if no keys then create the object
                rtn[key] = getObjectValue(tmplt_ref[key]);
            } else {
                // if any keys the create a container
                rtn[key] = getObjectContainer();
                // recursively call the function and start at new position of
                // tmplt_ref
                rtn[key].var_value = initTmplt(tmplt_ref[key]);
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
    this.createTmplt = (new_tmplt_obj) => {
        tmplt = initTmplt(new_tmplt_obj);
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
        return Object.assign({},tmplt);
    }

    if(constructor_tmplt_obj) { this.createTmplt(constructor_tmplt_obj); }
}

module.exports = DBTmplt;
