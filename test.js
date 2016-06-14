const DBEntry = require("./DBEntry.js");

var failed = false;

console.log("\n----------------------------");
console.log("\nstarting test 1");
console.log("\n----------------------------\n");

try {
    var entry_one = new DBEntry("user");
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
} catch (e) {
    console.log(e.stack);
    failed = true;
}

console.log();
entry_one.logCurrent();

try {
    console.log("\nclearing entry----------------------------\n",entry_one.clearEntry());
    console.log();
    entry_one.logCurrent();
} catch (e) {
    console.log(e.stack);
    failed = true;
}

console.log("\n----------------------------");
console.log( (failed) ? "\ntest failed" : "\ntest complete");
console.log("\n----------------------------\n");

failed = false;
/*
console.log("\n----------------------------");
console.log("\nstarting test 2");
console.log("\n----------------------------\n");

try {
    var thing = new DBEntry("test");
} catch(e) {
    console.log(e.stack);
    failed = true;
}

try {
    console.log("thing.number",thing.number,"\n");
    console.log("thing.name",thing.name,"\n");
    console.log("thing.cool",thing.cool,"\n");
} catch(e) {
    console.log(e.stack);
    failed = true;
}

try {
    console.log("getting objects for thing\n");
    console.log("typeof number",typeof thing.number,"\n");
    console.log("typeof name",typeof thing.name,"\n");
    console.log("typeof cool",typeof thing.cool,"\n");
} catch (e) {
    console.log(e.stack);
    failed = true;
}

try {
    console.log("settting objects for thing\n");
    thing.number = 84;
    console.log("thing.number",thing.number,"\n");
    thing.name = "dude";
    console.log("thing.name",thing.name,"\n");
    thing.cool = true;
    console.log("thing.cool",thing.cool,"\n");
} catch (e) {
    console.log(e.stack);
    failed = true;
}

try {
    console.log("getting objects for thing\n");
    console.log("typeof number",typeof thing.number,"\n");
    console.log("typeof name",typeof thing.name,"\n");
    console.log("typeof cool",typeof thing.cool,"\n");
} catch (e) {
    console.log(e.stack);
    failed = true;
}

console.log("\n----------------------------");
console.log( (failed) ? "\ntest failed" : "\ntest complete");
console.log("\n----------------------------\n");

console.log("secondary test\n");

var obj = {};

var thing = {
    other: {
        test: 2
    },
    dude: false
}

Object.defineProperty(obj,"key",{
    get: () => {
        return thing
    },
    set: (value) => {
        thing = thing
    }
});

Object.defineProperty(obj.key,"storage",{
    get: () => {
        return thing.other;
    },
    set: () => {
        thing.other = thing.other;
    }
});

console.log("obj.key:",obj.key,"\n");
console.log("obj.key.storage:",obj.key.storage,"\n");
*/
