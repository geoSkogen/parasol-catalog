

class Select {

  constructor () {
    this.dom_node = document.querySelector('#parasol-catalog-selector'),
    this.scroll_nodes = {
      up: document.querySelector('#product-select-scroll-up') ,
      down: document.querySelector('#product-select-scroll-down')
    }
    this.flex_tally = 0
  }

  get_flex_nodes (index) {

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
  }

  flex_item (index, appear) {

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
  }

  toggle_size (node,appear,denom,unit,floor,ceiling,root_node) {
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
  }

  pre_shrink (index) {
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
  }

  show_item (valid_row, row_index) {
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
    list_item.id = slug + '-catalog-item'

    anchor_tag.className = 'product-nav-anchor'
    anchor_tag.href = '#' + slug
    anchor_tag.appendChild(list_item)

    return anchor_tag
  }

}
