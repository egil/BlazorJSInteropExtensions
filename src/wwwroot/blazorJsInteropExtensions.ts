(function () {
    function findTarget(root: object, pathSteps: string[], maxSteps: number) {
        let target = root;
        for (let index = 0; index < maxSteps; index++) {
            const step = pathSteps[index];
            target = target[step];
        }
        return target;
    }

    function findRootObjectByName(objectName: string): object {
        switch (objectName.toLowerCase()) {
            case "document": return document;
            case "window": return window;
            default: throw new Error("Unknown object: " + objectName);
        }
    }

    function cssTimeToMilliseconds(time: string): number {
        const num = parseFloat(time);
        const unitRegex = time.match(/m?s/);
        const unit = unitRegex ? unitRegex[0] : undefined;
        let result = 0;
        switch (unit) {
            case "s": // seconds
                result = num * 1000;
                break;
            case "ms": // milliseconds
                result = num;
                break;
            default:
                result = 0;
                break;
        }
        return result;
    }

    function getTransitionDurationFromElement(element: Element): number {
        if (!element) return 0;
        const computedStyles = getComputedStyle(element);
        // Get transition-duration of the element
        let transitionDuration = computedStyles.transitionDuration;
        let transitionDelay = computedStyles.transitionDelay;
        const floatTransitionDuration = parseFloat(transitionDuration);
        const floatTransitionDelay = parseFloat(transitionDelay);
        // Return 0 if element or transition duration is not found
        if (!floatTransitionDuration && !floatTransitionDelay) return 0;
        // If multiple durations are defined, take the first
        transitionDuration = transitionDuration.split(",")[0];
        transitionDelay = transitionDelay.split(",")[0];
        return (
            cssTimeToMilliseconds(transitionDuration) +
            cssTimeToMilliseconds(transitionDelay)
        );
    }

    function invokeOn(rootObject: object, functionPath: string, functionArguments: any[]): any {
        const pathParts = functionPath.split(".");
        const fnName = pathParts[pathParts.length - 1];
        const target = findTarget(rootObject, pathParts, pathParts.length - 1);
        const func = target[fnName];
        return func.apply(target, functionArguments || []);
    }

    function invokeOnWithReturnDelay(returnDelay: number, rootObject: Element, functionPath: string, functionArguments: any[]) {
        return new Promise(function (resolve, reject) {
            const result = invokeOn(rootObject, functionPath, functionArguments);
            setTimeout(function () {
                resolve(result);
            }, returnDelay);
        });
    }

    function invokeOnWithTransitionReturnDelay(rootObject: Element, functionPath: string, functionArguments: any[]) {
        const delay = getTransitionDurationFromElement(rootObject);
        return invokeOnWithReturnDelay(
            delay,
            rootObject,
            functionPath,
            functionArguments
        );
    }

    function invokeOnNamed(objectName: string, functionPath: string, functionArguments: any[]): any {
        return invokeOn(findRootObjectByName(objectName), functionPath, functionArguments);
    }

    function getPropOn(rootObject: object, propPath: string): any {
        const pathParts = propPath.split(".");
        return findTarget(rootObject, pathParts, pathParts.length);
    }

    function setPropOn(rootObject: object, propPath: string, value: any): void {
        const pathParts = propPath.split(".");
        const propName = pathParts[pathParts.length - 1];
        const target = findTarget(rootObject, pathParts, pathParts.length - 1);
        target[propName] = value;
    }

    function getPropOnNamed(objectName: string, propPath: string): any {
        return getPropOn(findRootObjectByName(objectName), propPath);
    }

    function setPropOnNamed(objectName: string, propPath: string, value: any): void {
        return setPropOn(findRootObjectByName(objectName), propPath, value);
    }

    const blazorInvokeHelper = {};
    blazorInvokeHelper["invokeOn"] = function(rootObject: Element, functionPath: string, returnDelay: number, functionArguments: any[]): any
    {
        return returnDelay
            ? invokeOnWithReturnDelay(returnDelay, rootObject, functionPath, functionArguments)
            : invokeOn(rootObject, functionPath, functionArguments);
    }

    blazorInvokeHelper["invokeOnWithTransitionReturnDelay"] = invokeOnWithTransitionReturnDelay;
    blazorInvokeHelper["invokeOnNamed"] = invokeOnNamed;
    blazorInvokeHelper["getPropOn"] = getPropOn;
    blazorInvokeHelper["setPropOn"] = setPropOn;
    blazorInvokeHelper["getPropOnNamed"] = getPropOnNamed;
    blazorInvokeHelper["setPropOnNamed"] = setPropOnNamed;

    window["blazorInvokeHelper"] = blazorInvokeHelper;
})();
