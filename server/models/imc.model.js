const mongoose = require("mongoose");

const ImcSchema = new mongoose.Schema(
  {
    altura: {
      type: Number,
      required: [true, "Agregar una altura es requerido"],
    },
    peso: {
      type: Number,
      required: [true, "Agregar un peso es requerido"],
    },
    imc: {
      type: Number,
      required: [true, "Agregar un imc es requerido"],
    },
  },
  { timestamps: true }
);

module.exports.Imc = mongoose.model("Imc", ImcSchema);
module.exports.ImcSchema = ImcSchema;
