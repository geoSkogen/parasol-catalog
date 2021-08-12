'use strict'

console.log('this is catalog sam')

const app = {

  field_names : ['title','author','date','label','image'],

  data : { catalog_items: [], product_info : {} },

  dom_node: document.querySelector('#parasol-catalog-wrapper') ,

  list : {
    dom_nodes: [],

    shuffle: function (data_row) {

      const result_arr = []

      for (let i = Number(data_row.index); i < app.data.catalog_items.length; i++) {
        app.data.catalog_items[i]
        result_arr.push(app.data.catalog_items[i])
      }

      for (let i = 0; i < Number(data_row.index); i++) {
        result_arr.push(app.data.catalog_items[i])
      }

      app.data.catalog_items = result_arr
    }
  },

  select : {

    dom_node : document.querySelector('#parasol-catalog-selector'),
    scroll_nodes: {
      up: document.querySelector('#product-select-scroll-up') ,
      down: document.querySelector('#product-select-scroll-down')
    },

    get_flex_nodes :  function (index) {

      const parent_item = document.querySelectorAll('.product-nav-anchor')[index+1]
      const collection =
      { this_item : parent_item,
        item : {
          node: parent_item.querySelector('.catalog-list-item'),
          height: 151
        },
        image: {
          node: parent_item.querySelector('.product-image'),
          height: 125
        },
        lines : {
          nodes : parent_item.querySelectorAll('.product-info-line'),
          height: 16
        }
      }
      return collection
    },

    flex_tally : 0,

    flex_item : function (index, appear) {

      const flex_nodes = this.get_flex_nodes(index)

      Object.keys( flex_nodes ).forEach( ( node_key ) => {
        if (flex_nodes[node_key].node || flex_nodes[node_key].nodes) {

          let unit = flex_nodes[node_key].height/100

          if (node_key==='lines') {
            //
            flex_nodes[node_key].nodes.forEach( (p) => {

              if (appear) { p.style.fontSize = '0px' }

              this.toggle_size(
                p,                          // target element
                appear,                     // appear or disappear?
                'fontSize',                 // css property to increment
                unit,                       // degree by whih to inrement
                0,                          // lowest desired value
                flex_nodes[node_key].height,// highest desired value
                flex_nodes.this_item                   // wrapper element
              )
            })
          } else {

            if (appear) { flex_nodes[node_key].node.style.height = '0px' }

            this.toggle_size(
              flex_nodes[node_key].node, // target element
              appear,                    // appear or disappear?
              'height',                  // css property to increment
              unit,                      // degree by whih to icnrement
              0,                         // lowest desired value
              flex_nodes[node_key].height,// highest desired value
              flex_nodes.this_item                   // wrapper element
            )
          }
        }
      })
    },

    toggle_size : function (node,appear,denom,unit,floor,ceiling,root_node) {
      var n = appear? floor : ceiling
      var effect
      root_node.style.display = 'block'
      effect = setInterval( () => {

        n += (appear) ? unit : -unit
        node.style[denom] = n.toString() + 'px'

        if (appear && n>=ceiling || !appear && n<=floor) {

          clearInterval(effect)
          this.flex_tally++

          if (this.flex_tally===6) {
            var i = (appear) ? 0.0 : 0.5
            var aftereffect
            this.flex_tally = 0
            aftereffect  = setInterval( () => {

              i += (appear) ? 0.01 : -0.01
              root_node.querySelector('.catalog-list-item').style.paddingTop = i.toString() + 'em'
              root_node.querySelector('.catalog-list-item').style.paddingBottom = i.toString() + 'em'

              if (appear && i >= 0.5 || !appear && i <= 0.0) {
                clearInterval(aftereffect)
              }
            }, 2.5)
          }
        }
      }, 2.5 )
    },

    pre_shrink : function (index) {
      const flex_nodes = this.get_flex_nodes(index)

      Object.keys( flex_nodes ).forEach( ( node_key ) => {
        let prop
        if (flex_nodes[node_key].node || flex_nodes[node_key].nodes) {

          prop = (node_key=='lines') ? 'fontSize' : 'height'

          if (node_key=='lines') {

            flex_nodes[node_key].nodes.forEach( (p) => {
              p.style[prop] = '0px'
            })
          } else {
            flex_nodes[node_key].node.style[prop] = '0px'
          }
        }
      })
    },

    scroll : function (arg,json) {

      const row_indices = {
        'down' : app.data.catalog_items.length-1,
        'up' : 1
      }
      const data_row = json ? JSON.parse(json) : JSON.parse(
        document.querySelectorAll('.catalog-list-item')[row_indices[arg]].getAttribute('meta')
      )
      app.list.shuffle(data_row)
      app.init(app.data.catalog_items, true)
      
      register_app_events(true)
    },

    show_item : function (valid_row, row_index) {
      //
      let list_item = document.createElement('li')
      let anchor_tag = document.createElement('a')
      let img_tag = document.createElement('img')
      let info_box = document.createElement('div')
      let slug = valid_row.title.replace(/\s/g,'-').toLowerCase()

      valid_row.slug = slug

      Object.keys(valid_row).forEach( (key) => {

        if (key==='image') {
          img_tag.src = 'img/' + valid_row[key] + '.jpg'
          //
        } else {
          if (key!='index' && key!='slug') {
            let content = document.createTextNode(valid_row[key])
            let line = document.createElement('p')
            line.setAttribute('meta',key)
            line.className = 'product-info-line ' + key

            line.appendChild(content)
            info_box.appendChild(line)
          }
        }
      })

      info_box.className = 'product-info-box'
      img_tag.className = 'product-image'
      valid_row.index = row_index

      list_item.appendChild(img_tag)
      list_item.appendChild(info_box)
      list_item.setAttribute('meta',JSON.stringify(valid_row))
      list_item.className = 'catalog-list-item flex-row flex-start'

      anchor_tag.className = 'product-nav-anchor'
      anchor_tag.href = '#' + slug
      anchor_tag.appendChild(list_item)

      return anchor_tag
    }

  },

  detail : {

    img_node: document.querySelector('#catalog-detail-image'),
    meta_node: document.querySelector('#product-detail-meta'),
    title_node: document.querySelector('#catalog-detail-title'),
    title_anchor : document.querySelector('#catalog-detail-title-anchor'),

    selected : {},

    show : function (data_row) {
      //
      let title_div = document.createElement('div')
      let subtitle_div = document.createElement('div')
      let main_props = ['title','author','image','index','slug']

      this.selected = data_row

      title_div.appendChild(document.createTextNode(data_row.title))
      subtitle_div.appendChild(document.createTextNode(data_row.author))

      this.meta_node.innerHTML = ''
      this.title_node.innerHTML = ''
      this.img_node.src = 'img/' + data_row.image + '-detail.jpg'
      this.title_anchor.href = '#' + data_row.slug + '#detail'

      this.title_node.appendChild(title_div)
      this.title_node.appendChild(subtitle_div)

      Object.keys(data_row).forEach( (key) => {

        if ( main_props.indexOf(key)===-1 ) {
          let el = document.createElement('div')
          let meta_text = document.createTextNode(data_row[key])

          el.className = 'meta-detail'
          el.setAttribute('meta',key + '-detail')
          el.appendChild(meta_text)
          this.meta_node.appendChild(el)
        }
      })
    }
  },

  modal : {

    dom_node: document.querySelector('#product-detail-modal'),
    content_node: document.querySelector('#product-detail-modal-interior'),
    close_modal_node: document.querySelector('.close-modal'),

    show_info : function (data_row) {

      const modal_nodes = {
        'description' : {

          node: document.createElement('section'),
          process : function (data_str) {
            let wrapper = document.createElement('div')
            this.node.appendChild(document.createTextNode(data_str))
            this.node.className = 'product-description'
            wrapper.className = 'flex-row flex-center'
            wrapper.appendChild(this.node)
            return wrapper
          }
        },
        'playlist' : {

          node :document.createElement('ul'),
          process : function (data_arr) {
            let wrapper = document.createElement('div')
            data_arr.forEach( (datum) => {
              let list_item = document.createElement('li')
              list_item.appendChild( document.createTextNode( datum) )
              this.node.appendChild( list_item)
            })
            this.node.className = 'playlist'
            wrapper.className = 'flex-row flex-center'
            wrapper.appendChild(this.node)
            return wrapper
          }
        },
        'rating' : {

          process: function (assoc_arr) {

            const text_frags = {
              'rating' : {
                pre: ' Rated ',
                post: ''
              },
              'highest' : {
                pre: ' out of ',
                post: ' stars'
              },
              'total' : {
                pre: ' based on ',
                post: ' '
              },
              'source' : {
                pre: '',
                post: ' ratings.'
              }
            }

            let wrapper = document.createElement('div')
            const node = document.createElement('p')
            let star_node = this.star_process(assoc_arr.rating)

            Object.keys(assoc_arr).forEach( (key) => {

              let span = document.createElement('span')

              span.appendChild( document.createTextNode(
                text_frags[key].pre + assoc_arr[key].toString() + text_frags[key].post
              ))
              span.className = 'review-aggregate-' + key
              node.appendChild(span)
            })
            node.className = 'review-rating'
            wrapper.className = 'flex-row flex-center'
            wrapper.appendChild(star_node)
            wrapper.appendChild(node)
            return wrapper
          },

          star_process : function (int) {

            const path = 'img/gold-star.png'
            const coeff = Number(int) * 20;
            const style_rule = "height:25px;width: " + coeff + "%;background: url( " +
             path + " ) repeat-x 0 0;background-position: 0 -25px;"
            const element = document.createElement('div')
            const wrapper = document.createElement('div')

            element.setAttribute('style',style_rule)
            element.id = 'aggregate-review-rating-stars'
            wrapper.style.width = '120px'
            wrapper.appendChild(element)

            return wrapper
          }
        }
      }

      this.content_node.innerHTML = ''

      Object.keys( modal_nodes ).forEach( (prop) => {

        var modal_el = {}

        if (data_row[prop]) {
          //
          modal_el = modal_nodes[prop].process(data_row[prop])
          this.content_node.appendChild(modal_el)
        }
      })
    },

    toggle : function (arg) {

      let resource = app.detail.selected.slug
      if (arg) {

        const appear = setTimeout( () => { this.dom_node.style.display = 'block' }, 100)
      } else {
        app.toggle_background(true, 0.1, 1)
        this.dom_node.style.display = 'none'
      }

      if (arg && !app.data.product_info[resource]) {

        const xhttp = new XMLHttpRequest();

        xhttp.open("GET", "data/fake-catalog-api/" + resource + ".json", true)
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onreadystatechange = function() {

          if (this.readyState == 4 && this.status == 200) {

            let resp = this.responseText

            app.data.product_info[resource] = resp
            //
            app.modal.show_info(JSON.parse(resp))
          }
        }
        xhttp.send()
      }
    }

  },

  init : function (data, reset) {

    var i = 0
    this.select.dom_node.innerHTML = ''

    data.forEach( (row) => {

      let valid_row = (reset) ? row : this.valid_row(row)
      let list_item = this.select.show_item( valid_row, i )

      this.list.dom_nodes = []
      this.list.dom_nodes.push( list_item )
      valid_row.slug = valid_row.title.replace(/\s/g,'-').toLowerCase()

      if (!reset) {
        this.data.catalog_items.push( valid_row )
      }

      this.select.dom_node.appendChild(list_item)
      i++
    })
  },

  valid_row : function (obj) {
    //
    this.field_names.forEach( (key) => {
      if ( !obj[key] ) {
        obj[key] = (key==='image') ?
          'img/placeholder.jpg' : '(not set)'
      } // some actual validation here
    })
    return obj
  },

  grade_light : function (n,arg) {
    this.dom_node.style.opacity = n
    n += (arg) ? 0.025 : -0.025
    n = (n <= 0.02) ? 0 : n
    n = (n >= 0.98) ? 1 : n
    return n
  },

  toggle_background : function (appear,floor,ceiling) {
    var n = appear? floor : ceiling
    var effect
    effect = setInterval( () => {

      n = this.grade_light(n,appear)
      if (appear && n>=ceiling || !appear && n<=floor) {
      //
        clearInterval(effect)
      }

    }, 21.32)
  }
}

function register_app_events(reset) {

  document.querySelectorAll('.catalog-list-item').forEach( (list_item) => {
    //
    list_item.addEventListener('click', function (event) {
      //
      let json_string = this.getAttribute('meta')

      console.log('list item clicked')
      console.log(json_string)
      //
      app.select.scroll(null, json_string)
      app.detail.show( JSON.parse(json_string) )
    })
  })

  if (!reset) {
    //
    ['up','down'].forEach( (dir) => {

      app.select.scroll_nodes[dir].addEventListener('click', function (event) {
      //  console.log('got scroll node click ' + dir)
        var delay
        var node
        var clone
        var length
        const flex_vals = {
          'up' : false,
          'down' : true
        }

        if (dir==='up') {
          // copy the fiest catalog menu item
          node = document.querySelectorAll('.product-nav-anchor')[1]
          clone = node.cloneNode(true)
          // add the copy of former first menu item to the bottom of the list
          app.select.dom_node.appendChild(clone)
          length = document.querySelectorAll('.product-nav-anchor').length
          // last menu item appears collapsed then let grow to full size
          app.select.pre_shrink(length-2)
          app.select.flex_item(length-2, true)
          // collapse the top menu item
          app.select.flex_item(0, flex_vals[dir])
          // 0.6 second delay while menu items transform before menu toggle
          delay = setTimeout( () => {
            // reset menu order & view
            app.select.scroll(dir,null)
          }, 600)

        } else if (dir==='down') {
          length = document.querySelectorAll('.product-nav-anchor').length
          // copy the last catalog menu item
          node = document.querySelectorAll('.product-nav-anchor')[length-1]
          // reset menu order & view
          app.select.scroll(dir,null)
          // first menu item appears collapsed then let grow to full size
          app.select.pre_shrink(0)
          app.select.flex_item(0,true)
          // add the copy of former final menu item to the bottom of the list
          app.select.dom_node.appendChild(node)
          // collapse the bottom menu item
          app.select.flex_item(
            length-1,
            false
          )
          // 0.6 second delay while bottom item collapses before removing it
          delay = setTimeout( () => {
            app.select.dom_node.removeChild(node)
          }, 600)
        }
      })
    })

    app.detail.title_anchor.addEventListener('click', function (event) {

      app.toggle_background(false, 0.1, 1)
      app.modal.toggle(true)
    })

    app.modal.close_modal_node.addEventListener('click', function (event) {

      app.toggle_background(true, 0.1, 1)
      app.modal.toggle(false)
    })
  }
}
// MAIN
window.addEventListener('load', () => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", "data/fake-catalog-api.json", true)
  xhttp.setRequestHeader("Content-Type", "application/json");

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {

      let resp = this.responseText
      //
      // Render the catalog DOM
      app.init( JSON.parse(resp), false)
      //
      // Set a placeholder for the detail view
      // NOTE: add conditional here for reponse to URL params
      app.detail.show( app.data.catalog_items[0] )
      //
      //
      register_app_events(false)
    }
  }
  xhttp.send()
})
