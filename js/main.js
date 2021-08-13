

const select = new Select
const detail = new Detail
const modal = new Modal
//
const app = new App(select,detail,modal)


// MAIN
window.addEventListener('load', () => {

  let selected_data_row = {}

  let selected_json = ''

  const select_string = window.location.href.split('#')[1] ?
    window.location.href.split('#')[1] : ''

  const modal_string = window.location.href.split('#')[2] ?
    ( window.location.href.split('#')[2]==='detail' ?
        window.location.href.split('#')[2] : '' ) : ''

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
      // get reponse to URL params
      if (select_string && document.querySelector('#' + select_string + '-catalog-item') ) {

        selected_json = document.querySelector('#' + select_string + '-catalog-item').getAttribute('meta')
        selected_data_row = JSON.parse( selected_json)
        //
        app.scroll(null, selected_json)

      } else {
        selected_data_row = app.data.catalog_items[0]
      }
      // Set a placeholder for the detail view
      app.detail.show( selected_data_row )

      if (modal_string) { app.toggle_modal(true) }
      //
      //
      app.register_events(false)
    }
  }
  xhttp.send()
})
