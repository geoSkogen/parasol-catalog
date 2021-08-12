

class Modal {

  constructor () {
    this.dom_node = document.querySelector('#product-detail-modal'),
    this.content_node = document.querySelector('#product-detail-modal-interior'),
    this.close_modal_node = document.querySelector('.close-modal')
  }

  show (data_row) {

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
  }

}
