```javascript
var embedBox = new EmbedBox({
  embedCode: "<script src='{{PROJECT_URL}}/examples/library.js'></script>",
  events: {
    onLoad: function() {
      console.log(this) // EmbedBox instance
      alert("EmbedBox loaded!")
    }
  }
})
```
