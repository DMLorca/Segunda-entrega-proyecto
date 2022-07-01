const {ContenedorFirebase} = require('../../ContenedorFirebase');

class ProductosDaoFirebase extends ContenedorFirebase {

  constructor(db, query) {
    super(db, query);
    
  }

  async getByIdProd(numberId){
    try {
      let find = {id:""};
        const resultados = (await this.query.get()).docs;
        resultados.map(resultado => {
          if (resultado.data().id == numberId)
          find = resultado.data();
        });
      return find;
    } catch (error) {
      console.log("Error en getByIdChart(): " + error);
    }
  }

  async addProd(objProd) {
    try {

      for (; ;) {

        let save = await this.getByIdChart(this.idc);

        if (save.id) { //Si existe el idc, incrementa en 1 y comprueba otra vez
          this.idc++;
        } else {          //Si no existe el indice, entonces lo guarda y devuelve el guardado
          objProd.id = this.idc;
          const newProd = this.query.doc();
          const res = await newProd.create(objProd);
          return res;
        }
      }
    } catch (error) {
      console.log("Error en addChart(): " + error);
    }
  }


}

module.exports.ProductosDaoFirebase = ProductosDaoFirebase;