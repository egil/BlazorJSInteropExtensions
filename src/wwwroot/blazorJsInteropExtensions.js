(function () {
    function findTarget(root, pathSteps, maxSteps) {
        var target = root;
        for (var index = 0; index < maxSteps; index++) {
            var step = pathSteps[index];
            target = target[step];
        }
        return target;
    }
    function findRootObjectByName(objectName) {
        switch (objectName.toLowerCase()) {
            case "document": return document;
            case "window": return window;
            default: throw new Error("Unknown object: " + objectName);
        }
    }
    function cssTimeToMilliseconds(time) {
        var num = parseFloat(time);
        var unitRegex = time.match(/m?s/);
        var unit = unitRegex ? unitRegex[0] : undefined;
        var result = 0;
        switch (unit) {
            case "s":
                result = num * 1000;
                break;
            case "ms":
                result = num;
                break;
            default:
                result = 0;
                break;
        }
        return result;
    }
    function getTransitionDurationFromElement(element) {
        if (!element)
            return 0;
        var computedStyles = getComputedStyle(element);
        var transitionDuration = computedStyles.transitionDuration;
        var transitionDelay = computedStyles.transitionDelay;
        var floatTransitionDuration = parseFloat(transitionDuration);
        var floatTransitionDelay = parseFloat(transitionDelay);
        if (!floatTransitionDuration && !floatTransitionDelay)
            return 0;
        transitionDuration = transitionDuration.split(",")[0];
        transitionDelay = transitionDelay.split(",")[0];
        return (cssTimeToMilliseconds(transitionDuration) +
            cssTimeToMilliseconds(transitionDelay));
    }
    function invokeOn(rootObject, functionPath, functionArguments) {
        var pathParts = functionPath.split(".");
        var fnName = pathParts[pathParts.length - 1];
        var target = findTarget(rootObject, pathParts, pathParts.length - 1);
        var func = target[fnName];
        return func.apply(target, functionArguments || []);
    }
    function invokeOnWithReturnDelay(returnDelay, rootObject, functionPath, functionArguments) {
        return new Promise(function (resolve, reject) {
            var result = invokeOn(rootObject, functionPath, functionArguments);
            setTimeout(function () {
                resolve(result);
            }, returnDelay);
        });
    }
    function invokeOnWithTransitionReturnDelay(rootObject, functionPath, functionArguments) {
        var delay = getTransitionDurationFromElement(rootObject);
        return invokeOnWithReturnDelay(delay, rootObject, functionPath, functionArguments);
    }
    function invokeOnNamed(objectName, functionPath, functionArguments) {
        return invokeOn(findRootObjectByName(objectName), functionPath, functionArguments);
    }
    function getPropOn(rootObject, propPath) {
        var pathParts = propPath.split(".");
        return findTarget(rootObject, pathParts, pathParts.length);
    }
    function setPropOn(rootObject, propPath, value) {
        var pathParts = propPath.split(".");
        var propName = pathParts[pathParts.length - 1];
        var target = findTarget(rootObject, pathParts, pathParts.length - 1);
        target[propName] = value;
    }
    function getPropOnNamed(objectName, propPath) {
        return getPropOn(findRootObjectByName(objectName), propPath);
    }
    function setPropOnNamed(objectName, propPath, value) {
        return setPropOn(findRootObjectByName(objectName), propPath, value);
    }
    var blazorInvokeHelper = {};
    blazorInvokeHelper["invokeOn"] = function (rootObject, functionPath, returnDelay, functionArguments) {
        return returnDelay
            ? invokeOnWithReturnDelay(returnDelay, rootObject, functionPath, functionArguments)
            : invokeOn(rootObject, functionPath, functionArguments);
    };
    blazorInvokeHelper["invokeOnWithTransitionReturnDelay"] = invokeOnWithTransitionReturnDelay;
    blazorInvokeHelper["invokeOnNamed"] = invokeOnNamed;
    blazorInvokeHelper["getPropOn"] = getPropOn;
    blazorInvokeHelper["setPropOn"] = setPropOn;
    blazorInvokeHelper["getPropOnNamed"] = getPropOnNamed;
    blazorInvokeHelper["setPropOnNamed"] = setPropOnNamed;
    window["blazorInvokeHelper"] = blazorInvokeHelper;
})();
