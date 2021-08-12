

const select = new Select
const detail = new Detail
const modal = new Modal
//
const app = new App(select,detail,modal)



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
      app.register_events(false)
    }
  }
  xhttp.send()
})
