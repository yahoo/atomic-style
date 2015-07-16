# AtomicStyle

This lib provides atomic classSets and dedupes atomic classes, it is an Atomizer friendly replacement for the [classNames](https://github.com/JedWatson/classnames) module.

The atomic style class sets helps to remove duplication when there are many components repeating the same style over and over but it should not be overused the Atomic prefered way it to have reusable components with explicit atomic classes, the dedupe feature provided by this lib is very usefull for that.

## Install

```
npm install --save atomic-style
```

## How To Use?

Create some classSets to group atomic styles that are duplicated on your app.

```js
// config/styles/btn.json
// the AtomicStyle is a simple object where the keys is the style name,
// and the values can be eather a string, object or array.
{
    // you can use an Array
    'btn': [
        'H(30px) Lh(30px)',
        'Bgc(#ccc)',
        'C(#000)',
        ... // more styles
    ],

    // you can use an String
    'btn-blue': "Bgc(blue) C(#fff)",

    // or you can use an object
    'btn-lg': {
        'H(50px)': true,
        'Lh(50px)': true
    }
}
```

Create a config file that load your classes.

```js
// config/atomize.js
'use strict';

// atomize-style return a singlethon object where all your styles will be merged
var atomize = require('atomic-style');

atomize.set([
    require('./styles/btn.json'),
    require('./styles/foobar.json'),
    ... // all other styles
]);

module.exports = atomize;
```

Now you can use your config/atomize to get classSets and dedupe stuff.

```jsx
// components/SomeComponent.jsx
var atomize = require('../config/atomize');

module.exports = React.createClass({
    displayName: 'SomeComponent',

    ...

    render: function () {
        // #dedupe can be used to merge classes
        var divClasses = atomize.dedupe('W(500px)', this.props.divClassName, {
            'W(100%)': this.props.isFullScreen
        });

        var customBtnClasses = atomize.get('btn btn-lg', {
            'C(#fff) Bgc(pink)': this.props.hasPinkBtn
        });

        return (
            <div className={divClasses}>
                <button className={atomize.get('btn')}>some button</button>
                <button className={atomize.get('btn btn-blue')}>Blue Button</button>
                <button className={customBtnClasses}>Large Custom Button</button>
            </div>
        )
    }
});
```

The `atomize.get` and `atomize.dedupe` both guaranty no duplication of same style, for more details and examples check the [tests](https://github.com/yahoo/atomic-style/tree/master/tests).

Code licensed under the MIT license. See LICENSE file for terms.
