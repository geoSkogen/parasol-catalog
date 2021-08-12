
const app = {

  h1 : document.querySelector('h1'),
  h2 : document.querySelector('h2'),
  h3 : document.querySelector('h3'),
  h4 : document.querySelector('h4'),
  h5 : document.querySelector('h5'),

  flex_item : function (element,property,start_val,end_val,unit,denomination,milisecs,callbacks) {

    var incrementing = (start_val < end_val) ? true : false;
    var i = start_val
    var effect = setInterval( () => {

      i+= (incrementing) ? unit : -unit
      element.style[property] = i.toString() + denomination

      if (incrementing && i >= end_val || !incrementing && i <= end_val) {

        let this_callback_array = Array.isArray(callbacks) ? callbacks[0] : null

        clearInterval(effect)

        if (Array.isArray(this_callback_array) && this_callback_array.length) {

          callbacks = callbacks.slice(1)

          this.flex_item(
            this_callback_array[0], // element
            this_callback_array[1], // property
            this_callback_array[2], // start_val
            this_callback_array[3], // end_val
            this_callback_array[4], // unit
            this_callback_array[5], // denomination
            this_callback_array[6], // milisecs
            callbacks
          )
        }
      }
    }, milisecs)
  }
}

/*
app.flex_item(app.h1,'fontSize',40,200,1,'px',5,[
  [app.h2,'fontSize',32,180,1,'px',5],
  [app.h3,'fontSize',27,160,1,'px',5],
  [app.h4,'fontSize',24,140,1,'px',5],
  [app.h5,'fontSize',25,120,1,'px',5]
])
*/

const blob = document.querySelector('#blob')

app.flex_item(blob,'left',25,2000,1,'px',5,[
  [blob,'left',2000,25,1,'px',5]
])
