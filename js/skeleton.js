'use strict'
console.log('this is skeleton jones')

function stray_light(el,n,arg) {
  el.style.opacity = n
  n += (arg) ? 0.025 : -0.025
  n = (n <= 0.02) ? 0 : n
  n = (n >= 0.98) ? 1 : n
  return n
}

function translate (el) {
  //
  let text = el.innerText
  let data = el.getAttribute('data')
  el.setAttribute('data',text)
  el.innerText = data
}

function init_alphaswap(el, index) {

  var trigger = setTimeout( function () {

  alphaswap(el, index, toggle_limits[index])

  //console.log('I am element number : ' + index.toString())
  //console.log('My timeout val was: ' + timeout_vals[index].toString())
  //console.log('My toggle limit val is: ' + toggle_limits[index].toString())

  }, timeout_vals[index])
}

function alphaswap(el, index, toggle_limit) {

  var arg = false
  var swap = setInterval( function () {
    var this_interval = 225
    if (arg) {
      //
      //el.style.opacity = ns[index].toString()
      var appear = setInterval( function () {
          //
        ns[index] = stray_light(el,ns[index], true)
          //
        if (ns[index]>=0.99) {
          //translate(el)
          el.opacity = '1'
          el.setAttribute('data-toggle','1')
          clearInterval(appear)

        }
      }, this_interval)
    } else {
      //
      //el.style.opacity = ns[index].toString()
      var disappear = setInterval( function () {
          //
        ns[index] = stray_light(el,ns[index], false)
          //
        if (ns[index]<=0.01) {
          //el.opcity = '0'
          translate(el)
          el.setAttribute('data-toggle','0')
          clearInterval(disappear)
        }
      }, this_interval)
    }

    arg = !arg
    swap_count[index]++
    //
    if (swap_count[index] >= toggle_limit) {
      clearInterval(swap)
    }

  }, 4500 )
}



var text_nodes = []

const toggle_limits = []

const timeout_vals = []

const ns = []

var index = 0

var swap_count = []

window.addEventListener('load', function () {

  text_nodes = document.querySelectorAll('.translate')

  text_nodes.forEach( (node) => {

     timeout_vals.push(330/Math.random())

     toggle_limits.push(8)

     ns[index] = 1

     init_alphaswap(node, index)

     index++
  })
})
