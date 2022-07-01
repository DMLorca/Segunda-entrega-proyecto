const {ContenedorFirebase} = require('../../ContenedorFirebase');

class CarritosDaoFirebase extends ContenedorFirebase {

  constructor(db, query) {
    super(db, query);
  }


}

module.exports.CarritosDaoFirebase = CarritosDaoFirebase;
