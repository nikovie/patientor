import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { apiBaseUrl } from "../constants";
import { Patient, Gender } from "../types";
import { useStateValue } from "../state";

import { Box, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { Male, Female, Transgender } from '@mui/icons-material';

const PatientViewPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  if (!patients || !id) return null;

  const patientList = Object.values(patients);
  const patient = patientList.find(row => row.id === id);

  const fetchIndividualPatient = async () => {
    try {
      const { data: patientDataFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      dispatch({ type: "UPDATE_PATIENT_DATA", payload: patientDataFromApi });
    } catch (e) {
      console.error(e);
    }
  };
  
  const genderIcon = (gender: Gender) => {
    switch (gender) {
      case "male":
        return <Male />;
      case "female":
        return <Female />;
      case "other":
        return <Transgender />;
      default:
        return null;
    }
  };

  if (!patient) return null;

  React.useEffect(() => {
    if (patientList.length && (!patient.ssn || !patient.entries)) {
      void fetchIndividualPatient();
    }
  }, [dispatch]);

  return (
    <Box mt={2}>
      <Typography variant="h4" component="h2">
        { patient.name } { genderIcon(patient.gender) }
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary={'occupation'} secondary={patient.occupation} />
          <ListItemText primary={'dateOfBirth'} secondary={patient.dateOfBirth} />
          <ListItemText primary={'ssn'} secondary={patient.ssn} />
          <ListItemText primary={'entries'} secondary={patient.entries} />
        </ListItem>
      </List>
    </Box>
  );
};

export default PatientViewPage;
