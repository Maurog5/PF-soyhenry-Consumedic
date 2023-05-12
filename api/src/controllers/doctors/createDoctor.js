const { DoctorType, Especialidad, ObraSocial } = require("../../db");

const createDoctor = async (
  dni,
  NumMatricula,
  nombre,
  apellido,
  email,
  telefono,
  direccion,
  imagen,
  hashedPassword,
  titulo,
  Descripcion,
  precio,
  idEspecialidad,
  idObraSocial
) => {
  if (!idEspecialidad) {
    throw new Error("Se debe proporcionar al menos una especialidad");
  }

  const newDoctor = await DoctorType.create({
    dni,
    NumMatricula,
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    imagen,
    password: hashedPassword,
    titulo,
    Descripcion,
    precio,
  });

  if (idEspecialidad) {
    const newEspecialidad = await Especialidad.findAll({
      where: { id: idEspecialidad },
    });

    console.log("especialidad: ", newEspecialidad);
    newDoctor.addEspecialidads(newEspecialidad);
  }

  if (idObraSocial) {
    const newObraSocial = await ObraSocial.findAll({
      where: { id: idObraSocial },
    });

    console.log("obra social: ", newObraSocial);
    newDoctor.addObraSocials(newObraSocial);
  }

  return newDoctor;
};

module.exports = { createDoctor };
