DebugSettings = {};

function DEBUG(text) {
    Fn = DEBUG.caller.name;
    proceed_with_msg = false;

    if ('all' in DebugSettings) {
        if (!DebugSettings['all']) {
            return;
        }
        else if (DebugSettings['all']) {
            proceed_with_msg = true;
        }
    }
    else if (Fn in DebugSettings) {
        if (DebugSettings[Fn] == false) {
            proceed_with_msg = false;
        }
        else {
            proceed_with_msg = true;
        }
    }
    else {
        proceed_with_msg = true;
    }

    if (proceed_with_msg == true) {
        str = 'console.log("[" + Fn + "()] ::"';
        for (var i = 0; i < arguments.length; i++) {
            str += ', arguments[' + i + ']';
        }
        str += ');';
        eval(str);
    }

    return;
}

function DebugConfig(settings) {
    DebugSettings = settings;
}