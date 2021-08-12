

class Detail {

  constructor() {
    this.img_node = document.querySelector('#catalog-detail-image'),
    this.meta_node = document.querySelector('#product-detail-meta'),
    this.title_node = document.querySelector('#catalog-detail-title'),
    this.title_anchor = document.querySelector('#catalog-detail-title-anchor'),

    this.selected = {}
  }

  show (data_row) {

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

}
