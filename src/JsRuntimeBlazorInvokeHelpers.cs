using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;

namespace Microsoft.JSInterop
{
    // TODO: add support for CancellationToken/TimeSpan Invoke variants.
    public static class JsRuntimeBlazorInvokeHelpers
    {
        private const string JS_NAMESPACE = "blazorInvokeHelper";
        private const string WINDOW = "window";
        private const string DOCUMENT = "document";
        private const string INVOKE_ON = JS_NAMESPACE + ".invokeOn";
        private const string INVOKE_ON_TRANSITION_RETURN_DELAY = JS_NAMESPACE + ".invokeOnWithTransitionReturnDelay";
        private const string INVOKE_ON_NAMED = JS_NAMESPACE + ".invokeOnNamed";
        private const string GET_PROP = JS_NAMESPACE + ".getPropOn";
        private const string SET_PROP = JS_NAMESPACE + ".setPropOn";
        private const string GET_PROP_NAMED = JS_NAMESPACE + ".getPropOnNamed";
        private const string SET_PROP_NAMED = JS_NAMESPACE + ".setPropOnNamed";

        public static ValueTask InvokeOn(this IJSRuntime jSRuntime, ElementReference element, string functionPath, params object[] arguments) => InvokeOn(jSRuntime, element, functionPath, 0, arguments);
        public static ValueTask<T> InvokeOn<T>(this IJSRuntime jSRuntime, ElementReference element, string functionPath, params object[] arguments) => InvokeOn<T>(jSRuntime, element, functionPath, 0, arguments);
        public static ValueTask InvokeOn(this IJSRuntime jSRuntime, ElementReference element, string functionPath, int returnDelayMillisecond, params object[] arguments) => jSRuntime.InvokeVoidAsync(INVOKE_ON, returnDelayMillisecond, element, functionPath, arguments);
        public static ValueTask<T> InvokeOn<T>(this IJSRuntime jSRuntime, ElementReference element, string functionPath, int returnDelayMillisecond, params object[] arguments) => jSRuntime.InvokeAsync<T>(INVOKE_ON, returnDelayMillisecond, element, functionPath, arguments);
        public static ValueTask InvokeOnWithTransitionReturnDelay(this IJSRuntime jSRuntime, ElementReference element, string functionPath, params object[] arguments) => jSRuntime.InvokeVoidAsync(INVOKE_ON_TRANSITION_RETURN_DELAY, element, functionPath, arguments);
        public static ValueTask<T> InvokeOnWithTransitionReturnDelay<T>(this IJSRuntime jSRuntime, ElementReference element, string functionPath, params object[] arguments) => jSRuntime.InvokeAsync<T>(INVOKE_ON_TRANSITION_RETURN_DELAY, element, functionPath, arguments);
        public static ValueTask InvokeOnWindow(this IJSRuntime jSRuntime, string functionPath, params object[] arguments) => jSRuntime.InvokeVoidAsync(INVOKE_ON_NAMED, WINDOW, functionPath, arguments);
        public static ValueTask<T> InvokeOnWindow<T>(this IJSRuntime jSRuntime, string functionPath, params object[] arguments) => jSRuntime.InvokeAsync<T>(INVOKE_ON_NAMED, WINDOW, functionPath, arguments);
        public static ValueTask InvokeOnDocument(this IJSRuntime jSRuntime, string functionPath, params object[] arguments) => jSRuntime.InvokeVoidAsync(INVOKE_ON_NAMED, DOCUMENT, functionPath, arguments);
        public static ValueTask<T> InvokeOnDocument<T>(this IJSRuntime jSRuntime, string functionPath, params object[] arguments) => jSRuntime.InvokeAsync<T>(INVOKE_ON_NAMED, DOCUMENT, functionPath, arguments);
        public static ValueTask<string> GetPropertyFrom(this IJSRuntime jSRuntime, ElementReference element, string propertyPath) => GetPropertyFrom<string>(jSRuntime, element, propertyPath);
        public static ValueTask<T> GetPropertyFrom<T>(this IJSRuntime jSRuntime, ElementReference element, string propertyPath) => jSRuntime.InvokeAsync<T>(GET_PROP, element, propertyPath);
        public static ValueTask SetPropertyOn(this IJSRuntime jSRuntime, ElementReference element, string propertyPath, object value) => jSRuntime.InvokeVoidAsync(SET_PROP, element, propertyPath, value);
        public static ValueTask<string> GetPropertyFromDocument(this IJSRuntime jSRuntime, string propertyPath) => GetPropertyFromDocument<string>(jSRuntime, propertyPath);
        public static ValueTask<T> GetPropertyFromDocument<T>(this IJSRuntime jSRuntime, string propertyPath) => jSRuntime.InvokeAsync<T>(GET_PROP_NAMED, DOCUMENT, propertyPath);
        public static ValueTask SetPropertyOnDocument(this IJSRuntime jSRuntime, string propertyPath, object value) => jSRuntime.InvokeVoidAsync(SET_PROP_NAMED, DOCUMENT, propertyPath, value);
        public static ValueTask<string> GetPropertyFromWindow(this IJSRuntime jSRuntime, string propertyPath) => GetPropertyFromWindow<string>(jSRuntime, propertyPath);
        public static ValueTask<T> GetPropertyFromWindow<T>(this IJSRuntime jSRuntime, string propertyPath) => jSRuntime.InvokeAsync<T>(GET_PROP_NAMED, WINDOW, propertyPath);
        public static ValueTask SetPropertyOnWindow(this IJSRuntime jSRuntime, string propertyPath, object value) => jSRuntime.InvokeVoidAsync(SET_PROP_NAMED, WINDOW, propertyPath, value);
    }
}