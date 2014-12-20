<h1>Motley CSS</h1>
<p>A tool for splitting CSS files to fix the Internet Explorer selector limit of 4096 bug.</p>
<h1>Getting started</h1>
<p>
	In order to use motley you will need to require it and then it will return the motley function that you can call.
</p>
<code>
	var motley = require('motley');
	motley({
		fileName:'nameOfHugeCssFile.css',
		diagnostics:false,
		callback:function () {},
		limit:4095
	});
</code>
<h3>fileName (required)</h3>
<p>
	The file name is the name of the file that has the large amount of css inside of it. Motley will override it with the css that fits within IE's limits and then add imports to that file and create the rest of the files labeled fileName1, fileName2, etc as many files as are needed to stay under the specified limit or the IE limit.
</p>
<h3>diagnostics (optional)</h3>
<p>
	When set to true, diagnostic information will be printed when ran to keep track of things and see selector and comment count. The default value is false.
</p>
<h3>callback (optional)</h3>
<p>
	As this is an asynchronous operation the callback is for you to know when Motley is finished. By default this is undefined.
</p>
<h3>limit (optional)</h3>
<p>
	The library is for the IE limit of 4096 however if you would like the limit to be smaller or larger for performance testing that is allowed.
</p>
<h1>Contributing</h1>
<p>Create an issue and a PR and I will look into it.</p>
<h1>License</h1>
<p>MIT license found in the LICENSE file above.</p>