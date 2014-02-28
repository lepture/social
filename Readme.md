# Social Button

Share your notes with a beautiful social button.

View the demo at: http://lab.lepture.com/social/

## Getting Started

This is a ready to use widget, include the assets, and everything will
be ready:

```html
<link rel="stylesheet" href="http://lab.lepture.com/social/dist/widget.css">
<div class="social-button" data-twitter="lepture"
    data-facebook="lepture" data-weibo="lepture"
    data-count="true" data-text="Build software better, together."
    data-url="https://github.com/"></div>
<script src="http://lab.lepture.com/social/dist/widget.js"></script>
```

### Data API

The widget script will generate every elements that has the class name
`social-button`.

* **data-twitter**: fill with your twitter ID to enable twitter button
* **data-facebook**: fill with your facebook ID to enable facebook button
* **data-weibo**: fill with your weibo ID to enable weibo button
* **data-text**: text content to be shout out
* **data-url**: if not set, it will be current browsering location
* **data-count**: if set to true, it will show tweet count when hovering

### Advanced Data API

Here are the advanced data API, which you won't use in the daily life.

* **data-weibo-key**: a weibo APP key for querying link count
* **data-image**: a image url for weibo tweet
* **data-prefix**: icon class prefix, default is `icon-`

**The rest part of this documentation is for component.**

## Installation

Install with [component(1)](http://component.io):

    $ component install lepture/social

## API

```javascript
var social = require('social')
social(el, options)
```

### Options

* **twitter**: if not set, `data-twitter` will be used
* **facebook**: if not set, `data-facebook` will be used
* **weibo**: if not set, `data-weibo` will be used
* **text**: if not set, `data-text` will be used
* **url**: if not set, `data-url` will be used
* **count**: if not set, `data-count` will be used
* **weiboKey**: if not set `data-weibo-key` will be used
* **image**: if not set, `data-image` will be used
* **prefix**: if not set, `data-prefix` will be used

View the DATA API part for more detail.

## Notes

Component will download the script and stylesheet, but it will not
download the fonts. Chances are that you are using icon fonts already, it
would be better to combine all your icons in one font.

You can configure the icon class prefix with `prefix` option, the default
prefix is `icon-`. Keep in mind, that you have icons for:

* `.icon-twitter`
* `.icon-weibo`
* `.icon-facebook`

If you don't have any icon fonts. You can always download them from:

https://github.com/lepture/social/tree/master/dist/fonts

And this stylesheet:

https://github.com/lepture/social/blob/master/dist/style.css

## License

MIT
