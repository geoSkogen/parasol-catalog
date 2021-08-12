

class App {

  constructor(select,detail,modal) {

    this.field_names = ['title','author','date','label','image']
    this.data = { catalog_items: [], product_info : {} }

    this.dom_node = document.querySelector('#parasol-catalog-wrapper'),
    this.list_nodes = {}

    this.select = select
    this.detail = detail
    this.modal = modal
  }

  init (data, reset) {

    var i = 0
    this.select.dom_node.innerHTML = ''

    data.forEach( (row) => {

      let valid_row = (reset) ? row : this.valid_row(row)
      let list_item = this.select.show_item( valid_row, i )

      this.list_nodes = []
      this.list_nodes.push( list_item )
      valid_row.slug = valid_row.title.replace(/\s/g,'-').toLowerCase()

      if (!reset) {
        this.data.catalog_items.push( valid_row )
      }

      this.select.dom_node.appendChild(list_item)
      i++
    })
  }

  register_events (reset) {

    const self = this

    document.querySelectorAll('.catalog-list-item').forEach( (list_item) => {
      //
      list_item.addEventListener('click', function (event) {
        //
        let json_string = this.getAttribute('meta')
        //
        self.scroll(null, json_string)
        self.detail.show( JSON.parse(json_string) )
      })
    })

    if (!reset) {
      //
      ['up','down'].forEach( (dir) => {

        self.select.scroll_nodes[dir].addEventListener('click', function (event) {
        //  console.log('got scroll node click ' + dir)
          var delay
          var node
          var clone
          var length
          const flex_vals = {
            'up' : false,
            'down' : true
          }

          if ( !flex_vals[dir] ) {
            // copy the fiest catalog menu item
            node = document.querySelectorAll('.product-nav-anchor')[1]
            clone = node.cloneNode(true)
            // add the copy of former first menu item to the bottom of the list
            self.select.dom_node.appendChild(clone)
            length = document.querySelectorAll('.product-nav-anchor').length
            // last menu item appears collapsed then let grow to full size
            self.select.pre_shrink(length-2)
            self.select.flex_item(length-2, true)
            // collapse the top menu item
            self.select.flex_item(0, flex_vals[dir])
            // 0.6 second delay while menu items transform before menu toggle
            delay = setTimeout( () => {
              // reset menu order & view
              self.scroll(dir,null)
            }, 600)

          } else {
            length = document.querySelectorAll('.product-nav-anchor').length
            // copy the last catalog menu item
            node = document.querySelectorAll('.product-nav-anchor')[length-1]
            // reset menu order & view
            self.scroll(dir,null)
            // first menu item appears collapsed then let grow to full size
            self.select.pre_shrink(0)
            self.select.flex_item(0,true)
            // add the copy of former final menu item to the bottom of the list
            self.select.dom_node.appendChild(node)
            // collapse the bottom menu item
            self.select.flex_item(
              length-1,
              false
            )
            // 0.6 second delay while bottom item collapses before removing it
            delay = setTimeout( () => {
              self.select.dom_node.removeChild(node)
            }, 600)
          }
        })
      })

      self.detail.title_anchor.addEventListener('click', function (event) {

        self.toggle_background(false, 0.1, 1)
        self.toggle_modal(true)
      })

      self.modal.close_modal_node.addEventListener('click', function (event) {

        self.toggle_background(true, 0.1, 1)
        self.toggle_modal(false)
      })
    }
  }

  shuffle_list (data_row) {

    const result_arr = []

    for (let i = Number(data_row.index); i < this.data.catalog_items.length; i++) {
      this.data.catalog_items[i]
      result_arr.push(this.data.catalog_items[i])
    }

    for (let i = 0; i < Number(data_row.index); i++) {
      result_arr.push(this.data.catalog_items[i])
    }

    this.data.catalog_items = result_arr
  }

  scroll (arg,json) {

    const row_indices = {
      'down' : this.data.catalog_items.length-1,
      'up' : 1
    }
    const data_row = json ? JSON.parse(json) : JSON.parse(
      document.querySelectorAll('.catalog-list-item')[row_indices[arg]].getAttribute('meta')
    )
    this.shuffle_list(data_row)
    this.init(this.data.catalog_items, true)

    this.register_events(true)
  }

  valid_row (obj) {
    //
    this.field_names.forEach( (key) => {
      if ( !obj[key] ) {
        obj[key] = (key==='image') ?
          'img/placeholder.jpg' : '(not set)'
      } // some actual validation here
    })
    return obj
  }

  grade_light (n,arg) {
    this.dom_node.style.opacity = n
    n += (arg) ? 0.025 : -0.025
    n = (n <= 0.02) ? 0 : n
    n = (n >= 0.98) ? 1 : n
    return n
  }

  toggle_background (appear,floor,ceiling) {
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

  toggle_modal (arg) {

    let resource = this.detail.selected.slug
    if (arg) {
      this.toggle_background(false, 0.1, 1)
      const appear = setTimeout( () => { this.modal.dom_node.style.display = 'block' }, 100)
    } else {
      this.toggle_background(true, 0.1, 1)
      this.modal.dom_node.style.display = 'none'
    }

    if (arg && !this.data.product_info[resource]) {

      const xhttp = new XMLHttpRequest();
      const self = this

      xhttp.open("GET", "data/fake-catalog-api/" + resource + ".json", true)
      xhttp.setRequestHeader("Content-Type", "application/json");

      xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

          let resp = this.responseText

          self.data.product_info[resource] = resp
          //
          self.modal.show(JSON.parse(resp))
        }
      }
      xhttp.send()
    }
  }
}
