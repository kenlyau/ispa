var ISPA = function(options){
  var _this = this
 
  this.callback = options.callback || new Function
  this.hash
  this.prefix = options.prefix || ''
  this.anchor = options.anchor || 'data-anchor'
  this.iframe = typeof options.iframe == 'string'? document.getElementById(options.iframe) : iframe

  this.defaultHash = options.defaultHash 
  this.hash = this.getHash()

  this.handler(this.hash, true)

  if (!('onhashchange' in document.body)){
    throw new Error('is onhashchange not supported')
  }
  


  function poll(){
    var currHash = _this.getHash()
    if (currHash != _this.hash){
      _this.hash = currHash
      _this.handler(currHash, false)
    }
  }

  this.addEvent(window, 'hashchange', poll)
  this.bindEvents()
  
}

ISPA.prototype.addEvent = function(ele, type, callback){
  if (ele.addEventListener){
    ele.addEventListener(type, callback)
  }else if(ele.attachEvent){
    ele.attachEvent('on' + type, callback)
  }
}

ISPA.prototype.handler = function(newHash, init){
  if (this.callback(this, init) == false){
    return
  }
  var url
  var hash = newHash || this.defaultHash
  hash.replace(/\/+/g, '/')

  url = window.location.protocol + '//' + window.location.host + this.prefix + hash
  this.iframe.contentWindow.location.replace(url)
}
ISPA.prototype.bindEvents = function(){
  var _this = this
  this.addEvent(document, 'click', function(e){
  
    e = e || window.event
    el = e.target || e.srcElement
    if (el.tagName.toLowerCase() != 'a'){
      return
    }
    if (el.getAttribute(_this.anchor) != null){
      e.preventDefault ? e.preventDefault() : (e.returnValue = false)
     
      var hash = el.getAttribute('href')
      hash = hash.replace(/\/+/g, '/').replace(/(java|vb)script/g,'')
      window.location.hash = hash
    }
  })  
}

ISPA.prototype.go = function(newHash){
  if (newHash == this.hash) {
    return
  }
  window.location.hash = this.hash = newHash
  this.hanlder(newHash, false)
  
}
ISPA.prototype.getHash = function(){
  var index = window.location.href.indexOf('#')
  return (index == -1? '' : window.location.href.substr(index + 1))
}




