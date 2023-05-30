import React, { useState, useEffect, useContext } from "react";
import { Context, UtilitiesContext } from "../../../context/ContextProvider";
import Loading from "../../../components/Loading/Loading";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";

const EditProfile = () => {
  const { session } = useContext(Context)[2];
  const { patientDetail, modifyPatientProfiler, fetchPatientByEmail } =
    useContext(Context)[1];
  const { socialSecurity, fetchUtilities } = useContext(UtilitiesContext);
  const [loading, setLoading] = useState(true);
  const [inputClicked, setInputClicked] = useState(false);

  //Alerts
  const [snackOk, setSnackOk] = useState(false);
  const [snackFail, setSnackFail] = useState(false);
  const [snackOkMensaje, setSnackOkMensaje] = useState("");
  const [snackFailMensaje, setSnackFailMensaje] = useState("");

  useEffect(() => {
    setLoading(true);
    session.email &&
      fetchPatientByEmail(session.email).then(() => setLoading(false));
  }, [session.email]);

  useEffect(() => {
    if (!socialSecurity.length) {
      fetchUtilities();
    } else {
      setLoading(false);
    }
  }, [socialSecurity]);

  const { id, dni, email, telefono, nombre, apellido, ObraSocial } =
    patientDetail;

  const [datos, setDatos] = useState({
    id: id,
    nombre: nombre,
    apellido: apellido,
    dni: dni,
    email: email,
    telefono: telefono,
    obraSocial: 0,
  });

  const handleChange = (event) => {
    const property = event.target.name;
    let value = event.target.value;

    if (property === "obraSocial") {
      value = event.target.value.id;
    }

    setDatos({
      ...datos,
      [property]: value,
    });
  };

  const handleSave = () => {
    modifyPatientProfiler(datos)
      .then((data) => {
        setSnackOkMensaje("Se actualiazo correctamente!");
        setSnackOk(true);
        setInputClicked(false);
      })
      .catch((error) => {
        setSnackFailMensaje("No se ha podido actualizar la informacion!");
        setSnackFail(true);
      });

    fetchPatientByEmail(session.email);
    fetchUtilities();
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Snackbar
              open={snackOk}
              autoHideDuration={2500}
              onClose={() => {
                setSnackOk(false);
                setSnackOkMensaje("");
              }}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="success" variant="filled">
                <AlertTitle>Mensaje Exitoso</AlertTitle>
                {snackOkMensaje}
              </Alert>
            </Snackbar>
            <Snackbar
              open={snackFail}
              autoHideDuration={2500}
              onClose={() => {
                setSnackFail(false);
                setSnackFailMensaje("");
              }}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="error" variant="filled">
                <AlertTitle>Mensaje de Error</AlertTitle>
                {snackFailMensaje}
              </Alert>
            </Snackbar>
            <Typography sx={{ mb: 1.5, p: 1 }} color="text.secondary">
              Editar datos del Perfil
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                padding: "10px",
              }}
            >
              <TextField
                label="Nombre"
                name="nombre"
                value={datos.nombre}
                onChange={handleChange}
                sx={{ mt: "20px", width: "30%", ml: "10px" }}
                onClick={() => setInputClicked(true)}
              />
              <TextField
                label="Apellido"
                name="apellido"
                value={datos.apellido}
                onChange={handleChange}
                sx={{ mt: "20px", width: "30%", ml: "10px" }}
                onClick={() => setInputClicked(true)}
              />
              <TextField
                label="Dni"
                name="dni"
                value={datos.dni}
                onChange={handleChange}
                sx={{ mt: "20px", width: "30%", ml: "10px" }}
                onClick={() => setInputClicked(true)}
              />
              <TextField
                label="Teléfono"
                name="telefono"
                value={datos.telefono}
                onChange={handleChange}
                sx={{ mt: "20px", width: "30%", ml: "10px" }}
                onClick={() => setInputClicked(true)}
              />
              <TextField
                label="Email"
                name="email"
                value={datos.email}
                disabled
                sx={{ mt: "20px", width: "30%", ml: "10px" }}
                onClick={() => setInputClicked(true)}
              />

              <FormControl
                sx={{
                  mt: "20px",
                  width: "30%",
                  mb: "30px",
                  ml: "10px",
                }}
                size="small"
              >
                <InputLabel id="demo-select-small-label">
                  Obra Social
                </InputLabel>
                <Select
                  sx={{ height: "6vh" }}
                  MenuProps={{
                    sx: {
                      maxHeight: "50%",
                    },
                  }}
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  name="obraSocial"
                  value={datos.obraSocial}
                  label="Obra Social"
                  onChange={handleChange}
                  onClick={() => setInputClicked(true)}
                >
                  <MenuItem value="">
                    <em>Ninguna</em>
                  </MenuItem>
                  {socialSecurity?.map((obrasocial) => (
                    <MenuItem key={obrasocial.id} value={obrasocial}>
                      {obrasocial.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              sx={{ mt: "10px" }}
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!inputClicked}
            >
              Guardar
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default EditProfile;
