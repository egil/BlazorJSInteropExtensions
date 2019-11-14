# Blazor JSInterop Extensions
This library provides a set of handy extension methods to `IJSRuntime`, that makes it easy to make perform ad-hoc calls to JavaScript methods on DOM elements or the `window` or the `document` object. It also makes it easy to read and set properties on a DOM element and the `window` or the `document` object.

## Examples
To invoke a method on a DOM element, that you have a reference to via an `ElementReference`, use [`InvokeOn`](src/JsRuntimeBlazorInvokeHelpers.cs#L20) or [`InvokeOn<T>`](src/JsRuntimeBlazorInvokeHelpers.cs#L21), if you need a return value.

## Usage
1. Add the package to your Blazor WebAssembly or Blazor Server project via Nuget.
2. Include `<script src="_content/BlazorJSInteropExtensions/blazorJsInteropExtensions.js"></script>` in your index.html or _Host.cshtml.