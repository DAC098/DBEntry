const DBClass = require("./index.js");
const util = require("util");

var failed = false;

console.log("\n----------------------------");
console.log("\nstarting test 1");
console.log("\n----------------------------\n");

const AppTemplates = new DBClass();
AppTemplates.createTmplt("user",{pk: "",username: "",name: {first: "",last: ""},email: "",admin: false});
AppTemplates.createTmplt("true_test",{
    name: "",
    number: 0,
    bool: false,
    user: {
        name: {
            first: "",
            last: ""
        },
        password: "",
        admin: false,
        ref: [],
        other: {}
    }
});

try {
    var entry_one = AppTemplates.createEntry("user");
} catch(e) {
    console.log(e.stack);
    failed = true;
}

try {
    console.log("getting entry_one keys----------------------------\n");

    console.log("pk:",entry_one.pk);
    console.log("username:",entry_one.username);
    console.log("admin:",entry_one.admin);
    console.log("name:",entry_one.name);
    console.log("name object:",util.inspect(entry_one.name));
    console.log("name.first:",entry_one.name.first);
    console.log("name.last:",entry_one.name.last);
    console.log("email:",entry_one.email);
} catch(e) {
    console.log(e.stack);
    failed = true;
}

try {
    console.log("\nsetting entry_one keys----------------------------\n");

    entry_one.pk = "56";
    console.log("pk:",entry_one.pk);
    entry_one.username = "phil";
    console.log("username:",entry_one.username);
    entry_one.admin = true;
    console.log("admin:",entry_one.admin);
    entry_one.name = {};
    console.log("name:",entry_one.name);
    try {
        entry_one.name.first = "steve";
        console.log("name.first:",entry_one.name.first);
        entry_one.name.last = "evets"
        console.log("name.last:",entry_one.name.last);
    } catch(e) {
        console.log(e.stack);
        failed = true;
    }
    entry_one.email = "phil@dac.com";
    console.log("email:",entry_one.email);
} catch(e) {
    console.log(e.stack);
    failed = true;
}

console.log("entry_one:",util.inspect(entry_one));

try {
    console.log("\ngetting entry_one keys----------------------------\n");

    console.log("pk:",entry_one.pk);
    console.log("username:",entry_one.username);
    console.log("admin:",entry_one.admin);
    console.log("name:",entry_one.name);
    console.log("name.first:",entry_one.name.first);
    console.log("name.last:",entry_one.name.last);
    console.log("email:",entry_one.email);
} catch(e) {
    console.log(e.stack);
    failed = true;
}

try {
    console.log("\ngetting entry_one data----------------------------\n");
    console.log("entry_one:\n",entry_one.getEntry());
    var exclude_obj_one = {pk: true,name:true};
    var exclude_obj_two = {pk: true,name:{first:true}};
    console.log("\nexlcude one:",entry_one.getEntry("exclude",exclude_obj_one));
    console.log("\nexclude two:",entry_one.getEntry("exclude",exclude_obj_two));
    var include_obj_one = {username: true,name:true,email:true};
    var include_obj_two = {username: true,name:{first:true}};
    console.log("\ninclude one:",entry_one.getEntry("include",include_obj_one));
    console.log("\ninclude two:",entry_one.getEntry("include",include_obj_two));
} catch (e) {
    console.log(e.stack);
    failed = true;
}

console.log();
entry_one.logCurrent();

try {
    console.log("\nemptying entry----------------------------\n",entry_one.emptyEntry());
    console.log();
    entry_one.logCurrent();
} catch (e) {
    console.log(e.stack);
    failed = true;
}

try {
    console.log("\nseting entry----------------------------\n");
    entry_one.setEntry({
        pk: "98",
        username: "",
        name: {
            first: "david",
            last: "cathers",
        },
        email: "me@dac.com",
        admin: true
    });
    console.log("entry_one:",entry_one.getEntry());
} catch (e) {
    console.log(e.stack);
    failed = true;
}

console.log("\n----------------------------");
console.log( (failed) ? "\ntest failed" : "\ntest complete");
console.log("\n----------------------------\n");

failed = false;

console.log("\n----------------------------");
console.log("\nBig test");
console.log("\n----------------------------");

var big = AppTemplates.createEntry("true_test");

big.logCurrent();

var set_data = {
    name: "phil",
    number: 76,
    bool: true,
    user: {
        password: "",
        ref: ["dude","jog"],
        other: {
            thing: 0,
            stuff: "dude",
            what: "where"
        }
    }
}

try {
    console.log("\nseting entry----------------------------\n");
    big.setEntry({
        name: "phil",
        number: 76,
        bool: true,
        user: {
            password: "",
            ref: ["dude","jog"],
            other: {
                thing: 0,
                stuff: "dude",
                what: "where"
            }
        }
    });
    console.log("big:",big.getEntry());
} catch(e) {
    console.log(e.stack);
}

try {
    console.log("\ndeleting entry data from object----------------------------\n");
    delete big.user;
    console.log("big.user:",big.user);
    console.log("removing non-controlled data from entry object");
    delete big.user.other.thing;
    console.log("big.user.other:",big.user.other);
} catch (e) {
    console.log(e.stack);
}

try {
    console.log("\ngetting big data----------------------------\n");
    console.log("include one:",big.getEntry("include",{
        name: true,
        user: {
            name: true,
        }
    }));
    console.log("include two:",big.getEntry("include",{
        name: true,
        user: true
    }));

} catch (e) {
    console.log(e.stack);
}

big.emptyEntry();

big.logCurrent();

try {
    console.log("\nchecking for empty values----------------------------\n");
    var check = big.checkForEmpty();
    console.log("global check:",check.result,"\n");
    console.log("global found:",check.found,"\n");
    var required_values_one = {
        name: true,
        user: {
            name: true,
        },
    };
    var required_values_two = {
        name: true,
        user: true,
    }
    check = big.checkForEmpty(required_values_one);
    console.log("required values one check:",check.result,"\n");
    console.log("required values one found:",check.found,"\n");
    check = big.checkForEmpty(required_values_two);
    console.log("required values two check:",check.result,"\n");
    console.log("required values two found:",check.found,"\n");
} catch(e) {
    console.log(e.stack);
}
