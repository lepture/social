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

TODO

It can also be a component module. View the next section.

## Installation

Install with [component(1)](http://component.io):

    $ component install lepture/social

## API



## License

MIT
